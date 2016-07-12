(function(app) {
	function ArtistDetailConfig($stateProvider) {
		$stateProvider
		.state('artist_detail', {
			url: '/detail/:artist_id',
			templateUrl: 'views/artist_detail/artist_detail.html',
			controller: 'ArtistDetailController as adc',
			params: {
				artist_id: '',
				artist_name: ''
			}
		});
	}

	function ArtistDetailController() {
		var sc = this;
		
	}
	function ArtistDetailData(domo) {
		var TheArtistDetailData = {};

		// Some methods for fetching data to cache / retrieving data from cache here
		//     .then(function(artist){
		//       console.log("artist", artist);
		//     });

		return TheArtistDetailData;
	}

	app
	.config(['$stateProvider', ArtistDetailConfig])
	.controller('ArtistDetailController', [ArtistDetailController])
	.factory(['domo', ArtistDetailData])
	;
})(angular.module('swift'));
