app.controller("DialogController", function DialogController($scope, $mdDialog, ConnectionsConfig, connectionManager, localStorageService) {

  var dialog = this;

  var settingsStorageKey = "connectionSelection";

  dialog.loading = false;
  dialog.config = ConnectionsConfig;

  initializeDefaults();

  dialog.clear = function () {
    dialog.lastError = null;
    dialog.selectedHost = null;
    dialog.selectedCulture = null;
    dialog.selectedApp = null;
    updateLocalSelection(null);
  };

  dialog.connect = function () {
    dialog.loading = "indeterminate";
    dialog.lastError = null;
    var settings = {
      host: dialog.selectedHost,
      culture: dialog.selectedCulture,
      app: dialog.selectedApp,
      version: ConnectionsConfig.version
    };
    updateLocalSelection(settings);
    connectionManager.connect(settings).then(function () {
      dialog.isConnected = connectionManager.isConnected;
      $mdDialog.hide();
    }, function (err) {
      console.error(err);
      dialog.lastError = err;
    }).finally(function () {
      dialog.loading = false;
    });
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

  function initializeDefaults() {

    if (connectionManager.settings) {
      dialog.selectedHost = connectionManager.settings.host;
      dialog.selectedCulture = connectionManager.settings.culture;
      dialog.selectedApp = connectionManager.settings.app;
    } else {
      var previousSelection = localStorageService.get(settingsStorageKey);
      if (previousSelection) {
        dialog.selectedHost = _.findWhere(dialog.config.hosts, { env: previousSelection.host });
        dialog.selectedCulture = _.findWhere(dialog.config.cultures, { name: previousSelection.culture });
        dialog.selectedApp = _.findWhere(dialog.config.applications, { name: previousSelection.app });
      }
    }

    dialog.isConnected = connectionManager.isConnected;
  }

  function updateLocalSelection(settings) {
    if (settings) {
      localStorageService.set(settingsStorageKey, {
        host: settings.host.env,
        culture: settings.culture.name,
        app: settings.app.name
      });
    } else {
      localStorageService.remove(settingsStorageKey);
    }

  }

});