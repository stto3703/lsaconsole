app.directive("lsaMessages", function (connectionManager, $timeout, $document) {

  return {
    restrict: "E",
    scope: {},
    replace: true,
    controllerAs: "vm",
    templateUrl: "templates/messages.html",
    controller: function ($scope) {

      var vm = this;
      var isManualSelected = false;
      vm.messages = connectionManager.messages;

      vm.collapsed = true;
      vm.selectMessage = function (message) {
        var index = vm.messages.indexOf(message);
        vm.selectedMessage = message;
        isManualSelected = index !== 0;
      };

      vm.isSelected = function (message) {
        return message === vm.selectedMessage;
      };

      $scope.$watchCollection("vm.messages", function (collection) {
        if (!isManualSelected && collection.length) {
          vm.selectedMessage = collection[0];
        }
      });

    }
  };
});
