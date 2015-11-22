app.directive("lsaInvoker", function (connectionManager) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/invoker.html",
    scope: {},
    controllerAs: "vm",
    controller: function () {
      var vm = this;
      vm.hubMethods = [
        "subscribeEvent",
        "unsubscribeEvent",
        "subscribeMarket",
        "unsubscribeMarket",
        "subscribeBet(s)",
        "unsubscribeBet(s)"
      ];
      vm.selectedAction = this.hubMethods[0];
      vm.args = null;
      vm.invoke = function () {
        connectionManager.invokeHubMethod(vm.selectedAction, vm.args);
      };
    }
  };
});