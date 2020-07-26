const SettingsModel = require("./setting.model");

class Controller {
  constructor() {}
  save(name, value, is_public = false) {
    return SettingsModel.findOneAndUpdate(
      {
        name
      },
      {
        value,
        is_public
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }

  remove(name) {
    return SettingsModel.findOneAndRemove({
      name
    });
  }

  async getAll(name) {
    let query = {};
    if (name)
      query = {
        name
      };
    let settings = await SettingsModel.find(query).sort({
      name: 1
    });

    return settings.reduce(function(obj, param) {
      obj[param.name] = param.value;
      return obj;
    }, {});
  }

  async get() {
    let query = {
      is_public: true
    };
    let settings = await SettingsModel.find(query).sort({
      name: 1
    });

    return settings.reduce(function(obj, param) {
      obj[param.name] = param.value;
      return obj;
    }, {});
  }
}

module.exports = new Controller();
