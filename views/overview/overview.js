(function(app) {
	function OverviewConfig($stateProvider) {
		$stateProvider
		.state('overview', {
			url: '/',
			templateUrl: 'views/overview/overview.html',
			controller: 'OverviewController as oc'
		});
	}
	function OverviewController($scope, $state, $stateParams, OverviewData) {
		var oc = this;

		oc.tiles = _.range(25);
		oc.images = ['https://i.scdn.co/image/2f66abbf986dcc2fb1dca9bceb892123d5d10c3a', 'https://i.scdn.co/image/663f92496739278bf8b050cf8f76a6f4e7fc8581', 'https://i.scdn.co/image/6e04fd4fcc5b107f93dc1860941dc240e79e1295','https://i.scdn.co/image/28967fae3eaf33b0570b53cf621390204bf050d4','https://i.scdn.co/image/3866d7443de4c47b47367d45973afb20e78df161','https://i.scdn.co/image/671fb0a2ecb0c77cb693eb150bde7b6fa94b3f32'];

		$scope.$on('OverviewData:top artists ready', function(e, artists) {
			oc.top_artists = OverviewData.top_artists;
		});

		oc.goToDetail = function(artist) {
			$state.go('artist_detail', {artist_id: artist.canopus_id, artist_name: artist.artist_name});
		};
	}
	function OverviewData($rootScope, _, domo, SpotifyArtistData) {
		TheOverviewData = {};

		// THIS QUERY IS CRAP. IT WON'T ACTUALLY RETURN THE TOP ARTISTS
		domo.get('/data/v1/top_artists?limit=250&orderby=streams_total_rank ascending')
		.then(function(top_artists_data){
			var result = _.groupBy(top_artists_data, 'artist_name');
			result = _.sortBy(_.values(_.mapValues(result, function(artist_items_list) {
				return {
					artist_name: artist_items_list[0].artist_name,
					canopus_id: artist_items_list[0].canopus_id,
					streams_total: artist_items_list[0].streams_total,
					streams_total_rank: artist_items_list[0].streams_total_rank,
					spotify_uris: artist_items_list.map(function(item){return item.primary_artist_uri;})
				};
			})), function(item){return item.streams_total_rank;})
			.filter(function(item){return item.spotify_uris[0] !== 'null';})
			.slice(0,15);

			var spotify_uris = result.slice(0,15).map(function(item){return item.spotify_uris[0]});
			SpotifyArtistData.getOverviewArtistsData(spotify_uris)
			.then(function(response) {
				var spotify_lookup = _.fromPairs(response.artists.map(function(item) {
					return [item.uri.replace('spotify:artist:',''), item];
				}));

				result.map(function(artist_item) {
					artist_item.spotify_data = spotify_lookup[artist_item.spotify_uris[0]];
					return artist_item;
				});

				TheOverviewData.top_artists = result;
				console.log('top_artists', result);
				$rootScope.$broadcast('OverviewData:top artists ready', result);
			});
		});

		return TheOverviewData;
	}

	app
	.config(['$stateProvider', OverviewConfig])
	.controller('OverviewController', ['$scope', '$state', '$stateParams', 'OverviewData', OverviewController])
	.factory('OverviewData', ['$rootScope', '_', 'domo', 'SpotifyArtistData', OverviewData])
	;
})(angular.module('swift'));
