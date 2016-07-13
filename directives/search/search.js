(function(app) {
	function swiftSearch() {
		return {
			restrict: "E",
			templateUrl: "directives/search/search.html",
			scope: {},
			bindToController: {
				searchOpen: '='
			},
			controller: 'SwiftSearchController as sc'
		};
	}
	function SwiftSearchController($scope, $state, SwiftSearchData) {
		var sc = this;

		sc.loading = {
			artists: !SwiftSearchData.artists,
			albums: !SwiftSearchData.albums,
			songs: !SwiftSearchData.songs
		};
		
		$scope.$on('SwiftSearchData:artists ready', function(e, artists) {
			sc.loading.artists = false;
			$scope.$apply(function(){sc.artists = SwiftSearchData.getSwiftArtistResults(sc.search_text);});
		});
		$scope.$on('SwiftSearchData:tracks ready', function(e, artists) {
			sc.loading.songs = false;
			$scope.$apply(function(){sc.songs = SwiftSearchData.getSwiftTrackResults(sc.search_text);});
		});
		sc.getSwiftSearchResults = function() {
			if (sc.search_text) sc.artists = SwiftSearchData.getSwiftArtistResults(sc.search_text);
			if (sc.search_text) sc.songs = SwiftSearchData.getSwiftTrackResults(sc.search_text);
		};

		sc.goToDetail = function(artist) {
			console.log(artist);
			sc.search_text = '';
			$state.go('artist_detail', {artist_id: artist.canopus_id, artist_name: artist.artist_name});
		};
	}
	function SwiftSearchData($rootScope, _, domo) {
		var TheSwiftSearchData = {};
		var publicAPI = {};

		function preloadSwiftArtistsData() {
			domo.get('/data/v1/artists?groupby=artist_name&orderby=artist_name')
			.then(function(artists_data){
				TheSwiftSearchData.artists = artists_data;
				$rootScope.$broadcast('SwiftSearchData:artists ready', artists_data);
			});
		}
		preloadSwiftArtistsData();

		function preloadSwiftTracksData() {
			domo.get('/data/v1/tracks?groupby=resource_title&max=canopus_artist_name&limit=100000&orderby=resource_title')
			.then(function(tracks_data){
				console.log(tracks_data);
				TheSwiftSearchData.tracks = tracks_data;
				$rootScope.$broadcast('SwiftSearchData:tracks ready', tracks_data);
			});
		}
		preloadSwiftTracksData();



		publicAPI.getSwiftArtistResults = function(query_string) {
			if (query_string && TheSwiftSearchData.artists) return _.sortBy(TheSwiftSearchData.artists.filter(function(item) {
				return item.artist_name.toLowerCase().indexOf(query_string.toLowerCase()) > -1;
			}), function(item){return item.artist_name.toLowerCase().indexOf(query_string.toLowerCase());}).slice(0,25);

			else if (TheSwiftSearchData.artists) return TheSwiftSearchData.artists.sort().slice(0,25);

			else return [];
		}
		publicAPI.getSwiftTrackResults = function(query_string) {
			if (query_string && TheSwiftSearchData.tracks) return _.sortBy(TheSwiftSearchData.tracks.filter(function(item) {
				return item.resource_title.toLowerCase().indexOf(query_string.toLowerCase()) > -1;
			}), function(item){return item.resource_title.toLowerCase().indexOf(query_string.toLowerCase());}).slice(0,25);

			else if (TheSwiftSearchData.tracks) return TheSwiftSearchData.tracks.sort().slice(0,25);

			else return [];
		}

		
		return publicAPI;
	}

	function stopPropagation() {
		return {
			restrict: 'A',
			link: function(scope, element){
				element.bind('click', function(e) {
					e.stopPropagation();
				});
			}
		};
	}

	app
	.directive('swiftSearch', [swiftSearch])
	.controller('SwiftSearchController', ['$scope', '$state', 'SwiftSearchData', SwiftSearchController])
	.factory('SwiftSearchData', ['$rootScope', '_', 'domo', SwiftSearchData])
	.directive('stopPropagation', [stopPropagation])
	;
})(angular.module('swift'));
