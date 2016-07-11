(function(app) {
	function SearchConfig($stateProvider) {
		$stateProvider
		.state('search', {
			url: '/',
			templateUrl: 'views/search/search.html',
			controller: 'SearchController as sc'
		});
	}

	function SearchController($state) {
		var sc = this;

		sc.tiles = _.range(25);
		sc.images = ['https://i.scdn.co/image/dceb3cf4abf28d0ab0075b5daffa3f82e51fa7a3', 'https://i.scdn.co/image/7697a9c59c2c0fb8256c6320643188e654b042df', 'https://i.scdn.co/image/42b18b812b426f0685c90140f0cfc2e859964199'];

		sc.goToDetail = function() {
			$state.go('artist_detail');
		}
	}
	function SearchData(domo) {
		var TheSearchData = {};

		// Some methods for fetching data to cache / retrieving data from cache here
		// domo.get('/data/v1/artist')
		//     .then(function(artist){
		//       console.log("artist", artist);
		//     });

		return TheSearchData;
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
	.controller('SearchController', ['$state', SearchController])
	.factory(['domo', SearchData])
	.directive('stopPropagation', [stopPropagation])
	;
})(angular.module('swift'));
