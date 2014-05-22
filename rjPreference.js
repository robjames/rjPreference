/* global angular *//* https://github.com/robjames/rjPreference */
angular.module('rjPreference', [])
.service('rjStore', function(){
	if (!localStorage) return false; //no local storage
	return {
		save: function set(key, value) {
			if (typeof value === "object") {
				value = JSON.stringify(value);
			}
			localStorage.setItem(key, value);
			return this;
		},
		get: function get(key) {
			var value = localStorage.getItem(key);
			if (value === null) {
				return value;
			}
			// assume it is an object that has been stringified
			if (value[0] === "{" || value[0] === "[") {
				value = JSON.parse(value);
			}
			return value;
		},
		remove: function remove(key) {
			localStorage.removeItem(key);
			return this;
		}
	};
})
.directive('rjPreference', ['rjStore',function(store) {
	return {
		restrict:'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel){
			if (!store) return; //no local storage
			if (!ngModel) return; //no ngModel controller

			var key = attr.rjPreference;
			var storedVal = store.get(key);

			if (attr.type && attr.type.toLowerCase() === 'checkbox') {
				ngModel.$render = function() {
					ngModel.$viewValue = (ngModel.$viewValue === "false") ? false : (ngModel.$viewValue === "true") ? true : ngModel.$viewValue;
					element[0].checked = ngModel.$viewValue;
				};
			} else if (attr.type && attr.type.toLowerCase() === 'radio'){
				ngModel.$render = function() {
					var value = attr.value;
					element[0].checked = (value == ngModel.$viewValue);
				};
			} else {
				ngModel.$render = function() {
					element.val(ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue);
				};
			}

			if (!!storedVal) {
				ngModel.$setViewValue(storedVal);
				ngModel.$render();
			}

			ngModel.$viewChangeListeners.push(function(){
				store.save(key, ngModel.$modelValue);
			});

		}
	};
}]);
