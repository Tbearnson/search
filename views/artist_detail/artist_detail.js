(function(app) {
	function ArtistDetailConfig($stateProvider) {
		$stateProvider
		.state('artist_detail', {
			url: '/detail/:artist_id',
			templateUrl: 'views/artist_detail/artist_detail.html',
			controller: 'ArtistDetailController as adc',
			params: {
				artist_id: undefined,
				artist_name: ''
			}
		});
	}

	function ArtistDetailController($scope, $state, $stateParams, _, ArtistDetailData) {
		var adc = this;

		adc.selected_territory = 'XX';

		adc.selected_time = 'Last 30 Days'

		$scope.$on('ArtistDetailData:details ready', function(e) {
			$scope.$apply(function() {
				adc.details = ArtistDetailData[$stateParams.artist_id];
				adc.territories = _.keys(ArtistDetailData[$stateParams.artist_id]).sort();
				adc.time = ['Last 30 Days', 'Last 7 Days', 'Last 1 Day']
				adc.name = $stateParams.artist_name
			});
		});

		// Send out for artist details data on controller initialization
		ArtistDetailData.getArtistDetailData($stateParams.artist_id);
	}
	function ArtistDetailData($rootScope, _, domo) {
		var TheArtistDetailData = {};

		TheArtistDetailData.getArtistDetailData = function(canopus_id) {
			if (TheArtistDetailData[canopus_id]) return TheArtistDetailData[canopus_id];

			domo.get('/data/v1/artist_details?filter=canopus_id in ['+canopus_id+']&groupby=territory&max=canopus_artist_name')
			.then(function(detail_data){
				var result = _.groupBy(detail_data.map(function(item){
					return {
						name: item.canopus_artist_name,
						territory: item.territory,
						type_metrics: {
							labels: ["Paid","Free"],
							data: [item.streams_paid,item.streams_free],
							streams_free: item.streams_free,
							streams_paid: item.streams_paid,
							streams_total: item.streams_total
						},
						source_metrics: {
							labels: ["Collection","Other","Playlist","Undeveloped Playlist","Album","Artist","Search"],
							data: [item.source_collection_streams,item.source_other_streams,item.source_others_playlist_known_streams,item.source_others_playlist_unknown_streams,item.source_album_streams,item.source_artist_streams,item.source_search_streams],
							streams_collection: item.source_collection_streams,
							streams_other: item.source_other_streams,
							streams_playlist: item.source_others_playlist_known_streams,
							streams_undeveloped_playlist: item.source_others_playlist_unknown_streams,
							streams_album: item.source_album_streams,
							streams_artist: item.source_artist_streams,
							streams_search: item.source_search_streams
						},
						gender_metrics: {
							labels: ["Male","Female","Unknown"],
							data: [item.gender_male_streams,item.gender_female_streams,item.gender_unknown_streams],
							streams_male: item.gender_male_streams,
							streams_female: item.gender_female_streams,
							streams_unknown: item.gender_unknown_streams
						},
						engagement_metrics: {
							lean_forward: item.source_collection_streams + item.source_others_playlist_unknown_streams + item.source_album_streams + item.source_artist_streams + item.source_search_streams,
							lean_back: item.source_other_streams + item.source_others_playlist_known_streams
						},
						age_metrics: {
							labels: ["12 and Under","13 to 17","18 to 24","25 to 34","35 to 44","45 to 54","55 to 64","65 and up", "Unknown"],
							data: [item.age_group0to12_streams,item.age_group13to17_streams,item.age_group18to24_streams,item.age_group25to34_streams,item.age_group35to44_streams,item.age_group45to54_streams,item.age_group55to64_streams,item.age_group65_plus_streams,item.age_group_unknown_streams],
							streams_0to12: item.age_group0to12_streams,
							streams_13to17: item.age_group13to17_streams,
							streams_18to24: item.age_group18to24_streams,
							streams_25to34: item.age_group25to34_streams,
							streams_35to44: item.age_group35to44_streams,
							streams_45to54: item.age_group45to54_streams,
							streams_55to64: item.age_group55to64_streams,
							streams_65_plus: item.age_group65_plus_streams,
							streams_unknown: item.age_group_unknown_streams
						},
						source_demographics: {
							cluster01_streams: item.cluster01_streams,
							cluster02_streams: item.cluster02_streams,
							cluster03_streams: item.cluster03_streams,
							cluster04_streams: item.cluster04_streams,
							cluster05_streams: item.cluster05_streams,
							cluster06_streams: item.cluster06_streams,
							cluster07_streams: item.cluster07_streams,
							cluster08_streams: item.cluster08_streams,
							cluster09_streams: item.cluster09_streams,
							cluster10_streams: item.cluster10_streams,
							cluster11_streams: item.cluster11_streams,
							cluster12_streams: item.cluster12_streams,
							cluster13_streams: item.cluster13_streams
						},
						platform_metrics: {
							labels: ["Desktop","Mobile","Tablet","Other"],
							data: [item.device_type_desktop_streams,item.device_type_mobile_streams,item.device_type_tablet_streams,item.device_type_other_streams],
							streams_desktop: item.device_type_desktop_streams,
							streams_mobile: item.device_type_mobile_streams,
							streams_tablet: item.device_type_tablet_streams,
							streams_other: item.device_type_other_streams
						}
					};
				}), 'territory');
				// .map(function(item){return item[0];});
				TheArtistDetailData[canopus_id] = result;
				$rootScope.$broadcast('ArtistDetailData:details ready');
			});
		}

		
		return TheArtistDetailData;
	}

	app
	.config(['$stateProvider', ArtistDetailConfig])
	.controller('ArtistDetailController', ['$scope', '$state', '$stateParams', '_', 'ArtistDetailData', ArtistDetailController])
	.factory('ArtistDetailData', ['$rootScope', '_', 'domo', ArtistDetailData])
	;
})(angular.module('swift'));
