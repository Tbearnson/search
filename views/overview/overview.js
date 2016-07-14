(function(app) {
	function OverviewConfig($stateProvider) {
		$stateProvider
		.state('overview', {
			url: '/',
			templateUrl: 'views/overview/overview.html',
			controller: 'OverviewController as oc'
		});
	}
	function OverviewController($scope, OverviewData) {
		var oc = this;

		oc.tiles = _.range(25);
		oc.images = ['https://i.scdn.co/image/2f66abbf986dcc2fb1dca9bceb892123d5d10c3a', 'https://i.scdn.co/image/663f92496739278bf8b050cf8f76a6f4e7fc8581', 'https://i.scdn.co/image/6e04fd4fcc5b107f93dc1860941dc240e79e1295','https://i.scdn.co/image/28967fae3eaf33b0570b53cf621390204bf050d4','https://i.scdn.co/image/3866d7443de4c47b47367d45973afb20e78df161','https://i.scdn.co/image/671fb0a2ecb0c77cb693eb150bde7b6fa94b3f32'];

		$scope.$on('OverviewData:top artists ready', function(e, artists) {
			$scope.$apply(function(){oc.top_artists = OverviewData.top_artists;});
		});
	}
	function OverviewData($rootScope, domo) {
		TheOverviewData = {};

		// THIS QUERY IS CRAP. IT WON'T ACTUALLY RETURN THE TOP ARTISTS
		domo.get('/data/v1/top_artists?filter=territory=XX&orderBy=streams_total descending&limit=15')
		.then(function(top_artists_data){
			console.log('top_artists_data', top_artists_data);
			TheOverviewData.top_artists = top_artists_data;
			$rootScope.$broadcast('OverviewData:top artists ready', top_artists_data);
		});

		return TheOverviewData;
	}

	app
	.config(['$stateProvider', OverviewConfig])
	.controller('OverviewController', ['$scope', 'OverviewData', OverviewController])
	.factory('OverviewData', ['$rootScope', 'domo', OverviewData])
	;
})(angular.module('swift'));
