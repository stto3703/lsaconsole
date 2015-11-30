(function (ng, $) {

	'use strict';

	var moduleName = "lsa";

	ng.module(moduleName, []);

	ng.module(moduleName).provider("livebookStreamApi", function () {

		var serviceConfig = {
			triggerRootDigest: true,
			debug: false
		};

		this.configure = function (config) {
			angular.merge(serviceConfig, config);
		};

		this.$get = function ($rootScope, $q) {

			var constants = {
				connectionState: {
					0: 'connecting',
					1: 'connected',
					2: 'reconnecting',
					4: 'disconnected'
				}
			};

			function LivebookStreamApi(config) {
				this.config = config;
				this.connection = null;
				this.constants = constants;
			}

			LivebookStreamApi.prototype = {

				connect: function (options) {

					// Sample usage:
					/*
						connect({
							url: "https://lsa.itsfogo.com",
							app: 1,
							culture: "en-US",
							hubName: "bettingOfferHub",
							onHubReceived: {
								applyUpdate: function (data) {
									...
								}
							}
							onDataReceived: function(data) {
								
							},

						});
					
					*/

					var self = this;

					self.connection = $.hubConnection(options.url);

					self.connection.logging = self.config.debug;

					self.connection.qs = {
						culture: options.culture,
						app: options.app,
						version: options.version
					};

					self.connection.received(function (data) {
						if (angular.isFunction(options.onDataReceived)) {
							options.onDataReceived.apply(self, [data]);
							self._digest();
						}
					});

					self.connection.stateChanged(function (status) {
						self._digest();
					});

					self.proxy = self.connection.createHubProxy(options.hubName);

					angular.forEach(options.onHubReceived, function (callback, hubMethodName) {
						self.proxy.on(hubMethodName, function () {
							callback.apply(self, arguments);
							self._digest();
						});
					}.bind(self));


					var deferred = $q.defer();
					self.connection.start().then(function () {
						deferred.resolve();
					}).fail(function (err) {
						deferred.reject(err);
					});
					return deferred.promise;
				},

				disconnect: function () {
					var self = this;
					var deferred = $q.defer();
					if (self.connection) {
						self.connection.stop();
						self.proxy = null;
						self.connection = null;
						self.state = $.signalR.connectionState.disconnected;
						deferred.resolve();
					} else {
						deferred.reject();
					}
					return deferred.promise;
				},

				invoke: function (methodName, args) {
					var self = this;
					var deferred = $q.defer();
					if (self.getState() === $.signalR.connectionState.connected) {
						self.proxy.invoke(methodName, args).then(function (response) {
							deferred.resolve(response);
						}).fail(function (err) {
							deferred.reject(err);
						});
					} else {
						throw new Error("livebookStreamApi: Cannot invoke method " + methodName + " while disconnected.");
					}
					return deferred.promise;
				},

				getState: function () {
					return this.connection ?
						this.connection.state :
						$.signalR.connectionState.disconnected;
				},

				_digest: function () {
					if (this.config.triggerRootDigest) {
						$rootScope.$applyAsync();
					}
				}

			};

			return new LivebookStreamApi(serviceConfig);
		};

	});



})(window.angular, window.jQuery);