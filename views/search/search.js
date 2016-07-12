(function(app) {
	function SearchConfig($stateProvider) {
		$stateProvider
		.state('search', {
			url: '/',
			templateUrl: 'views/search/search.html',
			controller: 'SearchController as sc'
		});
	}

	function SearchController($scope, $state, SearchData) {
		var sc = this;

		sc.tiles = _.range(25);
		sc.images = ['https://i.scdn.co/image/dceb3cf4abf28d0ab0075b5daffa3f82e51fa7a3', 'https://i.scdn.co/image/7697a9c59c2c0fb8256c6320643188e654b042df', 'https://i.scdn.co/image/42b18b812b426f0685c90140f0cfc2e859964199'];
		sc.loading = {
			artists: true,
			albums: true,
			songs: true
		};
		
		$scope.$on('SearchData:artists ready', function(e, artists) {
			sc.loading.artists = false;
			$scope.$apply(function(){sc.artists = SearchData.getSearchResults(sc.search_text);});
		});
		sc.getSearchResults = function() {
			if (sc.search_text) sc.artists = SearchData.getSearchResults(sc.search_text);
		};

		sc.goToDetail = function(artist) {
			$state.go('artist_detail', {artist_id: artist.canopus_id, artist_name: artist.artist_name});
		};
	}
	function SearchData($rootScope, _, domo) {
		var TheSearchData = {};
		var publicAPI = {};

		function preloadSearchData() {
			console.log('beetles');
			domo.get('/data/v1/artists?groupby=artist_name&orderby=artist_name')
			.then(function(artists_data){
				TheSearchData.artists = artists_data.map(function(item){return item.artist_name;});
				$rootScope.$broadcast('SearchData:artists ready', artists_data);
				console.log("artists", artists_data);
			});
		}
		preloadSearchData();

		publicAPI.getSearchResults = function(query_string) {
			if (query_string && TheSearchData.artists) return _.sortBy(TheSearchData.artists.filter(function(item) {
				return item.toLowerCase().indexOf(query_string.toLowerCase()) > -1;
			}), function(item){return item.toLowerCase().indexOf(query_string.toLowerCase());}).slice(0,25);

			else if (TheSearchData.artists) return TheSearchData.artists.sort().slice(0,25);

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
	.config(['$stateProvider', SearchConfig])
	.controller('SearchController', ['$scope' ,'$state', 'SearchData', SearchController])
	.factory('SearchData', ['$rootScope', '_', 'domo', SearchData])
	.directive('stopPropagation', [stopPropagation])
	;
})(angular.module('swift'));
