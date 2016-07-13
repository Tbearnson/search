(function(app) {
	function Config($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}


	app
	.config(['$urlRouterProvider', Config])
	.constant('_', _)
	.constant('domo', domo)
	;
})(angular.module('swift',['ui.router','ui.bootstrap','chart.js']));