/* global angular */
var app = angular.module('LSAConsole', ['ngMaterial', 'ngJsonExplorer', 'LocalStorageModule', 'lsa']);

app.config(function ($sceProvider) {
  $sceProvider.enabled(false);
});

app.config(function (livebookStreamApiProvider) {
  livebookStreamApiProvider.configure({
    triggerRootDigest: true
  });
});

app.controller('AppController', function ($mdSidenav, $mdDialog, connectionManager) {
  var vm = this;

  vm.connectionManager = connectionManager;

  vm.showDialog = function (ev) {
    $mdDialog.show({
      controller: "DialogController as dialog",
      templateUrl: 'templates/connect.tpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    })
  };

  if (!connectionManager.isConnected) {
    vm.showDialog();
  }
});