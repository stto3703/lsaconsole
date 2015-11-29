app.service("connectionManager", function ($timeout, $q, $mdToast, $rootScope, localStorageService) {

  var connectionState = {
    0: 'connecting',
    1: 'connected',
    2: 'reconnecting',
    4: 'disconnected'
  };
  
  this.settings = null;
  this.isConnected = false;
  this.connectionState = connectionState[4];
  this.connection = null;
  this.messages = [];

  ///this.messages = localStorageService.get("mock");

  this.disconnect = disconnect;
  this.connect = connect;
  this.invokeHubMethod = invoke;

  function connect(settings) {
    var self = this;
    this.connection = $.hubConnection(settings.host.url);
    this.connection.qs = {
      culture: settings.culture.name,
      app: settings.app.id,
      version: settings.version
    };
    this.connection.received(function (data) {
      self.messages.unshift({
        index: self.messages.length,
        timestamp: new Date(),
        data: data
      });
      $rootScope.$applyAsync();
    });
    this.connection.stateChanged(function (status) {
      self.connectionState = connectionState[status.newState];
      $rootScope.$applyAsync();
    });
    this.proxy = this.connection.createHubProxy("bettingOfferHub");
    this.proxy.on("ApplyUpdate", function (data) {
      // self.messages.unshift(data);
      // $rootScope.$apply();
    });
    self.settings = settings;
    var deferred = $q.defer();
    this.connection.start().then(function () {
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
    }).fail(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function disconnect() {
    var self = this;
    var deferred = $q.defer();
    if (self.connection) {
      self.connection.stop();
      self.proxy = null;
      self.connection = null;
      self.isConnected = false;
      deferred.resolve();
    }
    return deferred.promise;
  }

  function invoke(methodName, args) {
    var self = this;
    var deferred = $q.defer();
    if (self.isConnected) {
      self.proxy.invoke(methodName, args).then(function (d) {
        deferred.resolve();
      });
    }
    return deferred.promise;
  }

});