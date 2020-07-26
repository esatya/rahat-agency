let Web3 = require("web3");
let cashAidArtifact = require("../../../build/contracts/CashAid");
let rsTokenArtifact = require("../../../build/contracts/AidToken");

App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  loading: false,
  tokensSold: 0,
  adminPanel: false,
  vendorPanel: false,
  adminAccount: "0x0",
  instance: null,
  web3Instance: null,
  networkId: 5777,

  init: function () {
    console.log("App initialized...");
    // console.log("hash", sha256("1234"));
    window.ethereum.on("accountsChanged", async function (accounts) {
      console.log(accounts);
      location.reload();
    });
    return App.initWeb3();
  },

  initWeb3: function () {
    if (window.ethereum) {
      // use MetaMask's provider
      console.log("MM  Connected");
      App.web3Provider = web3.currentProvider;
      App.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
      console.log("web3 version", App.web3.version);
      // if (typeof web3 !== "undefined") {
      //   // If a web3 instance is already provided by Meta Mask.
      //   console.log("MM  Connected");
      //   App.web3Provider = web3.currentProvider;
      //   web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      alert("Metamask not Connected");
      console.log("MM Note asjdfkjashf Connected");
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: async function () {
    console.log("contract initialized");
    // if (ethereum.networkVersion != 9670) {
    //   alert("Change your metamask network ");
    // }

    try {
      // get contract instance
      // const networkId = await App.web3.eth.net.getId();
      const deployedNetwork = cashAidArtifact.networks[App.networkId];
      console.log(deployedNetwork.address);
      App.web3Instance = await new App.web3.eth.Contract(
        cashAidArtifact.abi,
        deployedNetwork.address
      );

      console.log("WEB3 Instance", App.web3Instance);
      // get accounts
      const accounts = await App.web3.eth.getAccounts();
      console.log(accounts);
      App.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

    App.contracts.CashAid = TruffleContract(cashAidArtifact);
    App.contracts.CashAid.setProvider(App.web3Provider);
    App.contracts.CashAid.deployed().then(function (CashAid) {
      console.log("cash aid Sale Address:", CashAid.address);

      console.log("cashadi...", App.instance);
    });

    App.contracts.RSToken = TruffleContract(rsTokenArtifact);
    App.contracts.RSToken.setProvider(App.web3Provider);
    App.contracts.RSToken.deployed().then(function (RSToken) {
      $("#tokenAddress").html("RS TOKEN ADDRESS:" + RSToken.address);
      console.log("RS Token Address:", RSToken.address);
    });

    //App.listenForEvents();
    return App.render();
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.CashAid.deployed().then(function (instance) {
      instance
        .LogClaimed(
          {},
          {
            fromBlock: 0,
            toBlock: "latest"
          }
        )
        .watch(function (error, event) {
          console.log("event triggered.................................", event.args);
          App.render();
        });
    });
  },

  render: function () {
    if (App.loading) {
      return;
    }

    App.loading = true;

    var loader = $("#loader");
    var admin = $("#adminPanel");
    var vendor = $("#vendorPanel");

    loader.show();
    admin.hide();

    // Load account data

    web3.eth.getCoinbase(function (err, account) {
      if (!account) {
        alert("Metamask not Connected");
      }
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        console.log("your account", App.account);
      }
    });

    // Load CashAid contract
    // App.contracts.CashAid.deployed()
    //   .then(function (instance) {
    //     CashAidInstance = instance;
    //     return CashAidInstance.tokenPrice();
    //   })
    //   .then(function (tokenPrice) {
    //     App.tokenPrice = tokenPrice;
    //     $(".token-price").html(web3.fromWei(App.tokenPrice, "ether").toNumber());
    //     return CashAidInstance.tokensSold();
    //   })
    //   .then(function (tokensSold) {
    //     App.tokensSold = tokensSold.toNumber();
    //     $(".tokens-sold").html(App.tokensSold);
    //     $(".tokens-available").html(App.tokensAvailable);

    //     var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
    //     $("#progress").css("width", progressPercent + "%");

    // Load token contract

    App.contracts.CashAid.deployed().then(function (instance) {
      CashAidInstance = instance;
      CashAidInstance.admin(App.account).then(function (admin) {
        console.log("admin", admin);
        App.adminPanel = admin;
      });
      CashAidInstance.vendors(App.account).then(function (vendor) {
        console.log("vendor", vendor);
        App.vendorPanel = vendor;
      });
    });

    App.contracts.RSToken.deployed()
      .then(function (instance) {
        RSTokenInstance = instance;
        console.log("instancecc", instance);
        return RSTokenInstance.balanceOf(App.account);
      })
      .then(function (balance) {
        $(".RS-balance").html(balance.toNumber());
        console.log("balacnee", balance);
        App.loading = false;
        console.log("adminPanel", App.adminPanel);
        console.log("vendorPanel", App.vendorPanel);
        if (App.adminPanel) {
          admin.show();
        } else if (App.vendorPanel) {
          console.log("loading vendor panel");
          vendor.show();
        }

        loader.hide();
      });
    //});
  },

  registerBeneficiary: function () {
    $("#admin").hide();
    $("#loader").show();

    var beneficiary = Number($("#beneficiary").val());
    console.log("beneficiary", beneficiary, typeof beneficiary);
    console.log("version", web3.version);

    App.contracts.CashAid.deployed()
      .then(function (instance) {
        instance
          .beneficiary(beneficiary, {
            from: App.account,
            gasPrice: 20000000000,
            gas: 500000 // Gas limit
          })
          .then(function (result) {
            console.log(result);
            return result;
          })
          .catch(function (error) {
            console.log(error);
            return error;
          });
      })
      .then(function (result) {
        console.log("Registered...");
        $("form").trigger("reset"); // reset number of tokens in form
        $("#loader").hide();
        // Wait for Sell event
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  },

  registerVendor: function () {
    $("#admin").hide();
    $("#loader").show();

    var vendor = $("#vendor").val();
    console.log("vendor", vendor);
    App.contracts.CashAid.deployed()
      .then(function (instance) {
        return instance.vendor(vendor, {
          from: App.account,
          gasPrice: 20000000000,
          gas: 500000 // Gas limit
        });
      })
      .then(function (result) {
        console.log("Registered...");
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },

  issueToken: function () {
    // $("#admin").hide();
    // $("#loader").show();

    var phone = Number($("#phoneNumber").val());
    var amount = Number($("#issueAmount").val());

    App.contracts.CashAid.deployed()
      .then(function (instance) {
        return instance.issue(phone, amount, {
          from: App.account,
          gasPrice: 20000000000,
          gas: 500000 // Gas limit
        });
      })
      .then(function (result) {
        console.log(result);
        console.log("Registered...");
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },

  checkToken: function () {
    var phone = $("#check").val();
    App.contracts.CashAid.deployed()
      .then(function (instance) {
        return instance.claimables(phone, {
          from: App.account,
          gasPrice: 20000000000,
          gas: 500000 // Gas limit
        });
      })
      .then(function (result) {
        console.log(result);
        var claimables = result.toNumber();
        console.log("claimables", claimables);
        alert("total claimables for " + phone + " is : " + claimables);
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },

  claimToken: function () {
    var phone = Number($("#phone").val());
    var amount = Number($("#amount").val());

    App.contracts.CashAid.deployed()
      .then(function (instance) {
        return instance.claimTokens(phone, amount, {
          from: App.account,
          gasPrice: 20000000000,
          gas: 500000 // Gas limit
        });
      })
      .then(function (result) {
        console.log(result);
        console.log("Claimed...");
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },

  getToken: function () {
    var beneficiary = Number($("#beneficiaryNumber").val());
    var otp = $("#otp").val();
    console.log("otp", beneficiary, typeof otp);

    App.contracts.CashAid.deployed()
      .then(function (instance) {
        return instance.getTokens(beneficiary, otp, {
          from: App.account,
          gasPrice: 20000000000,
          gas: 500000 // Gas limit
        });
      })
      .then(function (result) {
        console.log(result);
        console.log("Token Received...");
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },

  signTransaction: async function () {
    var message = $("#message").val();
    console.log("message=", message);
    //var hexMessage = web3.utils.utf8ToHex(message);
    var signedMessage;
    console.log("web3-", App.web3.utils);
    var msg = App.web3.utils.toHex(message).substring(2);
    var padded = msg.padStart(64, "0");
    msg = "0x" + padded;

    let encoded = await App.web3Instance.methods.beneficiary(9841).encodeABI();
    console.log("encoded function call", encoded);

    console.log(msg);
    App.web3.eth.sign(msg, App.account, (error, sig) => {
      //console.log(account);
      console.log(sig);
      //alert("signed message:" + sig);
      signedMessage = sig;
      console.log("signed = ", signedMessage);
      alert("signed message:" + signedMessage);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
