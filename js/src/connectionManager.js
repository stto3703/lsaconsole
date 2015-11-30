app.service("connectionManager", function ($timeout, $q, $mdToast, $rootScope, localStorageService, livebookStreamApi) {

  this.settings = null;
  this.isConnected = false;
  this.messages = [];

  this.disconnect = disconnect;
  this.connect = connect;
  this.invokeHubMethod = invoke;
  this.getState = function () {
    return livebookStreamApi.constants.connectionState[livebookStreamApi.getState()];
  };

  function connect(settings) {

    var self = this;
    var deferred = $q.defer();

    livebookStreamApi.connect({
      url: settings.host.url,
      app: settings.app.id,
      culture: settings.culture.name,
      hubName: "bettingOfferHub",
      onHubReceived: {
        applyUpdate: function (data) {
          // console.log("received applyUpdate", data);
        }
      },
      onDataReceived: function (data) {
        self.messages.unshift({
          index: self.messages.length,
          timestamp: new Date(),
          data: data
        });
      }
    }).then(function () {

      self.isConnected = true;
      self.messages.length = 0;
      $mdToast.show(
        $mdToast.simple()
          .content('Connected!')
          .position("bottom right")
          .capsule(false)
          .hideDelay(3000)
        );
      deferred.resolve();
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function disconnect() {
    this.isConnected = false;
    return livebookStreamApi.disconnect();
  }

  function invoke(methodName, args) {
    return livebookStreamApi.invoke(methodName, args);
  }

});