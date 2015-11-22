app.directive("connectionIndicator", function (connectionManager) {
	return {
		restrict: "E",
		scope: {},
		replace: true,
		controllerAs: "vm",
		templateUrl: "templates/indicator.html",
		controller: function () {
			var vm = this;
			vm.connectionManager = connectionManager;
		}
	};
});