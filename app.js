(function(app) {
	function Config($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}

	function SpotifyArtistData($rootScope, $http) {
		var SpotifyArtistData = {};

		SpotifyArtistData.getSpotifyArtistData = function(uri_id) {
			if(SpotifyArtistData[uri_id]) {
				$rootScope.$broadcast('SpotifyArtistData:ready',uri_id);
				return SpotifyArtistData[uri_id];	
			}

			$http({
				method: 'GET',
				url: 'https://api.spotify.com/v1/artists/' + uri_id
			})
			.then(function(response) {
				SpotifyArtistData[uri_id] = response.data;
				$rootScope.$broadcast('SpotifyArtistData:ready',uri_id);
			})
			.catch(function(err) {
				console.log("Error getting Spotify data", err)
			});
		}
		SpotifyArtistData.getOverviewArtistsData = function(uri_ids) {
  			if(SpotifyArtistData.overview) {
  				return SpotifyArtistData.overview;	
  			}

  			return $http({
				method: 'GET',
				url: 'https://api.spotify.com/v1/artists/?ids=' + uri_ids.join(',')
			})
			.then(function(response) {
				SpotifyArtistData.overview = response.data;
				return SpotifyArtistData.overview;
  			})
  			.catch(function(err) {
  				console.log("Error getting Spotify data", err)
  			});
  		}

		return SpotifyArtistData;
	}


	app
	.config(['$urlRouterProvider', Config])
	.constant('_', _)
	.constant('domo', domo)
	.factory('SpotifyArtistData',['$rootScope','$http', SpotifyArtistData])
	;
})(angular.module('swift',['ui.router','ui.bootstrap','chart.js']));