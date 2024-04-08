App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(function (acc) {
            App.account = acc[0];
            App.displayAccountInfo();
          });

        //
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy DApp browsers...
    else if (window.web3) {
      web3.eth.getAccounts(function (err, accounts) {
        if (err === null) {
          App.account = accounts[0];
          App.displayAccountInfo();
        }
      });
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      App.displayAccountInfo();
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },
  displayAccountInfo: function () {
    $("#accountAddress").text("Your Account: " + App.account);
  },

  initContract: function () {
    $.getJSON("store.json", function (store) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.store = TruffleContract(store);
      // Connect provider to interact with contract
      App.contracts.store.setProvider(App.web3Provider);

      return App.bindEvents();

      return App.render();
    });
  },
  bindEvents: function () {
    $(document).on("click", "#pushImageBtn", App.handleUploadImage);
    $(document).on("click", "#pullImageBtn", App.showimage);
  },

  handleUploadImage: function (event) {
    event.preventDefault();

    var imageBase64 = $("#base64ImageInput").val();
    App.contracts.store
      .deployed()
      .then(function (instance) {
        return instance.pushimg(imageBase64, { from: App.account });
      })
      .then(function (result) {
        // Success, handle result
        // let imagescontainer = $("#imagescontainer");
        // imagescontainer.empty();
        // let imageel = `<img src="${imageBase64}"/>`;
        // imagescontainer.append(imageel);
        console.log("Image upload successful:", result);
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  showimage: function (event) {
    event.preventDefault();
    let imageBase64 = $("#selectImageInput").val();

    let imagesContainer = $("#imageContainer");
    imagesContainer.empty();

    App.contracts.store
      .deployed()
      .then(function (instance) {
        instance
          .returnImage(imageBase64, { from: App.account })
          .then(function (stringi) {
            let imageel = `<img src=data:image/png;base64,${stringi}/>`;
            imagesContainer.append(imageel);
            console.log("Image display successful:");
          });
      })
      .catch(function (err) {
        if (err.message.includes("revert")) {
          console.log("Caught error:", err.message);
        }
      });
  },

  render: function (event) {},
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
