(function(app) {
	function SearchConfig($stateProvider) {
		$stateProvider
		.state('search', {
			url: '/',
			templateUrl: 'views/search/search.html',
			controller: 'SearchController as sc'
		});
	}

	function SearchController() {
		var sc = this;

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

	app
	.config(['$stateProvider', SearchConfig])
	.controller('SearchController', [SearchController])
	.factory(['domo', SearchData])
	;
})(angular.module('swift'));
