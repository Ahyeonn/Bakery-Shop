App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../pastry.json', function(data) {
      var pastryRow = $('#pastryRow');
      var pastryTemplate = $('#pastryTemplate');

      for (i = 0; i < data.length; i ++) {
        pastryTemplate.find('.panel-title').text(data[i].name);
        pastryTemplate.find('img').attr('src', data[i].picture);
        pastryTemplate.find('.pastry-description').text(data[i].description);
        pastryTemplate.find('.pastry-date').text(data[i].date);
        pastryTemplate.find('.btn-purchase').attr('data-id', data[i].id);

        pastryRow.append(pastryTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
  // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Purchase.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PurchaseArtifact = data;
      App.contracts.Purchase = TruffleContract(PurchaseArtifact);
    
      // Set the provider for our contract
      App.contracts.Purchase.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the purchased pastries.
      return App.markPurchased();
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-purchase', App.handlePurchase);
  },

  markPurchased: function() {
    var purchaseInstance;

    App.contracts.Purchase.deployed().then(function(instance) {
      purchaseInstance = instance;
    
      return purchaseInstance.getPurchasers.call();
    }).then(function(purchasers) {
      for (i = 0; i < purchasers.length; i++) {
        if (purchasers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pastry').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
    
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var pastryId = parseInt($(event.target).data('id'));
    var purchaseInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Purchase.deployed().then(function(instance) {
        purchaseInstance = instance;
    
        // Execute pastry as a transaction by sending account
        return purchaseInstance.purchase(pastryId, {from: account});
      }).then(function(result) {
        return App.markPurchased();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
