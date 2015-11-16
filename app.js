/* global angular */
var app = angular.module('LSAConsole', ['ngMaterial']);

app.controller('AppController', function ($mdSidenav, $mdDialog, connectionManager) {
  var vm = this;

  function showAlert() {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
      );
  };

  vm.showDialog = function (ev) {
    $mdDialog.show({
      controller: "DialogController as dialog",
      templateUrl: 'templates/connect.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    })
      .then(function (answer) {
        vm.status = 'You said the information was "' + answer + '".';
      }, function () {
        vm.status = 'You cancelled the dialog.';
      });
  };

  if (!connectionManager.isConnected) {
    vm.showDialog();
  }
});



app.directive("lsaSubscriptions", function (connectionManager) {

  return {
    restrict: "E",
    templateUrl: "templates/subscriptions.html",
    scope: {},
    controller: function () {
      var vm = this;
      vm.subscribeEvent = function () {
        connectionManager.subscribeEvent(vm.eventId).then(function () {
          vm.eventId = null;
        });
      };
    },
    controllerAs: "vm"
  };

});

app.directive("lsaMessages", function (connectionManager) {

  return {
    restrict: "E",
    templateUrl: "templates/messages.html",
    scope: {},
    controller: function () {
      var vm = this;
      vm.messages = connectionManager.messages;
    },
    controllerAs: "vm"
  };

});



app.service("connectionManager", function ($timeout, $q, $mdToast, $rootScope) {

  this.settings = null;
  this.isConnected = false;
  this.connection = null;
  this.messages = [];

  this.disconnect = function () {
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
  };

  this.connect = function (settings) {
    var self = this;
    this.connection = $.hubConnection(settings.host.url);
    this.connection.qs = {
      culture: settings.culture.name,
      app: settings.app.id,
      version: settings.version
    };
    this.proxy = this.connection.createHubProxy("bettingOfferHub");
    this.proxy.on("ApplyUpdate", function (data) {
      self.messages.unshift(data);
      $rootScope.$apply();
    });
    self.settings = settings;
    var deferred = $q.defer();
    this.connection.start().then(function () {
      self.isConnected = true;
      self.messages.length = 0;
      $mdToast.show(
        $mdToast.simple()
          .content('Connected!')
          .position("top right")
          .capsule(true)
          .hideDelay(3000)
        );
      deferred.resolve();
    });
    return deferred.promise;
  };

  this.subscribeEvent = function (id) {
    var self = this;
    var deferred = $q.defer();
    if (self.isConnected) {
      self.proxy.invoke("subscribeEvent", id).then(function (d) {
        deferred.resolve();
      });
    }
    return deferred.promise;
  };

});

app.service("ConnectionsConfig", function () {

  this.version = "v1.0";

  this.hosts = [
    { env: "dev", url: "http://dev.lsa.itsfogo.com" },
    { env: "int", url: "http://integration.lsa.itsfogo.com" },
    { env: "fvt", url: "http://test.lsa.itsfogo.com" },
    { env: "beta", url: "https://beta-lsa.itsfogo.com" },
    { env: "prod", url: "https://lsa.itsfogo.com" }
  ];

  this.cultures = [
    { name: "en-US", value: 1 },
    { name: "de-DE", value: 2 },
  ];

  this.applications = [
    { name: "bwin.com", id: 1 },
    { name: "bwin.es", id: 132 },
    { name: "gamebookers.com", id: 142 }
  ];

});

app.controller("DialogController", function DialogController($scope, $mdDialog, ConnectionsConfig, connectionManager) {

  var dialog = this;

  dialog.loading = false;
  dialog.config = ConnectionsConfig;
  dialog.selectedHost = connectionManager.settings ? connectionManager.settings.host : null;
  dialog.selectedCulture = connectionManager.settings ? connectionManager.settings.culture : null;
  dialog.selectedApp = connectionManager.settings ? connectionManager.settings.app : null;
  dialog.isConnected = connectionManager.isConnected;

  dialog.clear = function () {
    dialog.selectedHost = null;
    dialog.selectedCulture = null;
    dialog.selectedApp = null;
  };

  dialog.connect = function () {
    dialog.loading = "indeterminate";
    connectionManager.connect({
      host: dialog.selectedHost,
      culture: dialog.selectedCulture,
      app: dialog.selectedApp
    }).then(function () {
      dialog.loading = false;
      dialog.isConnected = connectionManager.isConnected;
      $mdDialog.hide();
    }, function () {
      console.error("test");
    });
    
    // $mdDialog.hide();
    // $mdDialog.hide(answer);
    // $mdDialog.cancel();
  };

  dialog.disconnect = function () {
    dialog.loading = "indeterminate";
    connectionManager.disconnect().then(function () {
      dialog.loading = false;
      dialog.isConnected = connectionManager.isConnected;
    });
  };

  dialog.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

});