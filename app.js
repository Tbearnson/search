(function(app) {
	function Config($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}


	app
	.config(['$urlRouterProvider', Config])
	.constant('domo', domo)
	;
})(angular.module('swift',['ui.router','ui.bootstrap']));