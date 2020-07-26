const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const config = require("config");
const { UserManager } = require("rs-user");

const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");

const { DataUtils } = require("../../helpers/utils");
const { ERR } = require("../../helpers");

const messenger = require("../../helpers/utils/messenger");
const RoleController = require("../role/role.controller");

const createTokenData = async user => {
  let permissions = await RoleController.calculatePermissions(user.roles);
  return {
    permissions
  };
};

class UserController extends UserManager {
  login({ username, password, rememberMe = false }) {
    return this.authenticate({
      username,
      password,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration")
    });
  }

  loginExternal({ service, service_id, extras }) {
    return this.authenticateExternal({
      service,
      service_id,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration"),
      extras
    });
  }

  async loginMetamask({ signature, eth_address }) {
    console.log("ethereum", eth_address);
    let user = await this.models.UserModel.findOne({ eth_address });

    if (!user)
      return {
        status: false,
        error: `User with ethereum address ${eth_address} does not exist`
      };
    console.log(user);
    let sig = this.verifySignature(user, signature);
    console.log("signature", sig);
    if (!sig) {
      return { error: "signature not valid" };
    }

    let tokenData = await createTokenData(user);
    tokenData.address = eth_address;

    user.token = await this.generateToken(user, tokenData, config.get("jwt.duration"));

    return user;
  }

  async getNonce(eth_address) {
    try {
      let user = await this.models.UserModel.findOne({ eth_address });

      if (!user)
        return {
          error: `User with ethereum address ${eth_address} does not exist`
        };
      return user.nonce;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  verifySignature(user, signature) {
    console.log(config.get("signMsg") + user.nonce);
    //const msg = `To Login to system, you are requested to sign this one-time-nonce: ${user.nonce}`;

    const msgBufferHex = ethUtil.bufferToHex(
      Buffer.from(config.get("signMsg") + user.nonce, "utf8")
    );
    const address = sigUtil.recoverPersonalSignature({ data: msgBufferHex, sig: signature });

    //update nonce
    user.nonce = Math.floor(Math.random() * 10000);
    user.save();
    //compare derived address from user address
    if (address.toLowerCase() === user.eth_address) {
      return true;
    } else {
      return false;
    }
  }

  async addRoles({ user_id, roles }) {
    let isValid = await RoleController.isValidRole(roles);
    if (!isValid) throw ERR.ROLES_NOEXISTS;
    return super.addRoles({ user_id, roles });
  }

  list({ start, limit }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { "name.first": 1 },
      model: this.models.UserModel,
      query: [],
      facet_data: [
        {
          $lookup: {
            from: "users_comm",
            localField: "comms",
            foreignField: "_id",
            as: "comms"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            full_name: { $concat: ["$name.first", " ", "$name.last"] },
            comms: {
              $filter: {
                input: "$comms",
                as: "item",
                cond: {
                  $eq: ["$$item.is_primary", true]
                }
              }
            },
            is_active: 1,
            created_at: 1,
            updated_at: 1
          }
        }
      ]
    });
  }
}

module.exports = new UserController({
  mongoose,
  messenger,
  appSecret: config.get("app.secret"),
  jwtDuration: config.get("jwt.duration"),
  modelConfig: {
    User: {
      schema: {
        gender: String,
        dob: Date,
        nonce: { type: Number, default: Math.floor(Math.random() * 10000) },
        eth_address: { type: String, trim: true, unique: true, lowercase: true }
      }
    }
  }
});
