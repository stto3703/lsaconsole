/* global angular */
var app = angular.module('LSAConsole', ['ngMaterial', 'ngJsonExplorer', 'LocalStorageModule']);

app.config(function ($sceProvider) {
  $sceProvider.enabled(false);
});

app.controller('AppController', function ($mdSidenav, $mdDialog, connectionManager) {
  var vm = this;

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