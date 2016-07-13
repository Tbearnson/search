(function(app) {
	function domoDropdown($document) {
		return {
			restrict: "E",
			templateUrl: "directives/domoDropdown/domoDropdown.html",
			scope: {},
			controller: 'domoDropdownController as ddc',
			bindToController: {
				header: "@",
				placeholder: "@",
				list: "=",
				selected: "=",
				property: "@",
				sort: '='
			},
			link: function(scope, element, attr, ctrl) {
				$document.bind('click', function(event){
					var isClickedElementChildOfDropdown = element
						.find(event.target)
						.length > 0;

					if ( isClickedElementChildOfDropdown || event.target == element[0].children[0].children[1] ) return;
					else {
						if (ctrl.listVisible) {
							scope.$apply(function(){
								ctrl.listVisible = false;
							});
						}
					}
				});
			}
		};
	}
	function domoDropdownController() {
		var ddc = this;

		ddc.listVisible = false;

		ddc.select = function(item) {
			ddc.selected = item;
			ddc.listVisible = false;
			ddc.display = true;
		};

		ddc.isSelected = function(item) {
			return item[ddc.property] === ddc.selected[ddc.property];
		};

		ddc.toggle = function() {
			ddc.listVisible = !ddc.listVisible;
		};
	}

	app
	.directive('domoDropdown', ['$document', domoDropdown])
	.controller('domoDropdownController', [domoDropdownController])
	;
})(angular.module('swift'));
