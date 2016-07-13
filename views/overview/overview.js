(function(app) {
	function OverviewConfig($stateProvider) {
		$stateProvider
		.state('overview', {
			url: '/',
			templateUrl: 'views/overview/overview.html',
			controller: 'OverviewController as oc'
		});
	}
	function OverviewController() {
		var oc = this;

		oc.tiles = _.range(25);
		oc.images = ['https://i.scdn.co/image/dceb3cf4abf28d0ab0075b5daffa3f82e51fa7a3', 'https://i.scdn.co/image/7697a9c59c2c0fb8256c6320643188e654b042df', 'https://i.scdn.co/image/42b18b812b426f0685c90140f0cfc2e859964199'];
	}

	app
	.config(['$stateProvider', OverviewConfig])
	.controller('OverviewController', [OverviewController])
	;
})(angular.module('swift'));
