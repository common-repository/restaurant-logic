if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

var getUrlParameter = function (sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}

	return "";
};

var processConfigs = function(data, numSettings){
		var accounts = [];
		var accountsHandled = 0;
		var searchTerms = [];

		// One social account has X rows of settings. Hence, data.length/X = number of accounts.
		for(var accountNumber = 0; accountsHandled < Math.floor(data.length/numSettings) && accountNumber < 100; accountNumber++){
			var accountIdToHandle = "";
			var currentAccount = {};

			for(var index = 0; index < data.length; index++){
				var currentKey = data[index].settingKey.split('-');


				// If the account number of the current key matches the account number we're handling...
				if(parseInt(currentKey[1]) == accountNumber){
					// handle the value according to the key
					switch(currentKey[0]){
						case 'twitter_user_id':
						case 'instagram_user_id':
							currentAccount.userId = data[index].value;
							break;
						case 'facebook_page_id':
							currentAccount.pageId = data[index].value;
							break;
						case 'twitter_user_name':
						case 'instagram_user_name':
						case 'facebook_page_name':
							currentAccount.name = data[index].value;
							break;
						case 'instagram_user_username':
							currentAccount.username = data[index].value;
						case 'twitter_user_screen_name':
							currentAccount.screenName = data[index].value;
							break;
						case 'twitter_search_terms':
						case 'instagram_search_terms':
							searchTerms = data[index].value;
							break;
						case 'facebook_page_access_token':
							currentAccount.accessToken = data[index].value;
					}

					currentAccount.accountNumber = accountNumber;
				}
			}

			// If there are keys in the currentPage, then we have to process an account.
			if(Object.keys(currentAccount).length > 0){
				accounts[accountsHandled] = currentAccount;
				accountsHandled++;
			}
		}

		accounts.searchTerms = searchTerms;

		return accounts;
	};

/* example currentUser: {
 *	firstname: "Johnny",
 * 	lastname: "Good",
 * 	email: "jbgood@email.com",
 * 	organizationId: 1,
 * 	userId: "2",
 * 	username: 'johnnybgood'
 * 	accessToken: {
 * 			id: "O2uw6CuGEnw21NggIEHnpVnEQyrN6OiRDagDVd59zEKVD4qemUooLldEnARRcMH4",
 * 			ttl: 31556926,
 *			created: "2015-03-13T02:09:47.214Z"
 * 			userId: 2
 * 		}
 *  }
 */

var currentUser = null;
var googleAccessToken = null;
var cookies = document.cookie.split(/;\s*/);
for(var j = 0; j < cookies.length; j++){
	if(jQuery.trim(cookies[j]).substring(0, 14) == "PLAY_SESSION=\""){
		var sessionVars = cookies[j].substring(14, cookies[j].length - 1).split('&');
		for (var i = 0; i < sessionVars.length; i++) {
			var pair = sessionVars[i].split("=");
			if(/\w*\-{0,1}user/.test(pair[0])){
				currentUser = jQuery.parseJSON(decodeURIComponent(pair[1]));
			} else if(/\w*\-{0,1}gAccessToken/.test(pair[0])){
				googleAccessToken = decodeURIComponent(pair[1]);
			}
		}
	}
}


//Configure CKFinder
var finder = null;
if(typeof CKFinder === "function"){
	finder = new CKFinder({connectorInfo: 'auth_token=' + currentUser.accessToken.id + '&user_id=' + currentUser.userId+ '&organization_id=' + currentUser.organizationId});
	// The path for the installation of CKFinder (default = "/ckfinder/").
	finder.basePath = FILES_DOMAIN + '/files/';
	// The default height is 400.
	finder.height = 600;
}


angular.module('globalApp', ['ngSanitize', 'ui.bootstrap'])

.run(function($rootScope, $http, $q, $timeout, $window, $uibModal) {
	var accessToken = (currentUser && currentUser.accessToken) ? currentUser.accessToken.id : '';
	$http.defaults.headers.common.Authorization = accessToken;
	$http.defaults.headers.common.get = {'Authorization' : accessToken};
//	$http.defaults.headers.put.Authorization = accessToken;
//	$http.defaults.headers.post.Authorization = accessToken;



	$rootScope.verifyAccess = function(account){
		return $http.get('/social/facebook/verifyAccess/' + account.accessToken)
			.then(function(result){
				account.hasAccess = true;
				if(result){
					if(result.data.data && result.data.data.error){
						account.errorMessage = result.data.data.error.message;
						account.hasAccess = false;
					} else if(result.data.data){
						var requiredPermissions = ["read_page_mailboxes","read_insights","manage_pages","publish_pages","public_profile"];
						
						requiredPermissions.forEach(function(perm){
							if(result.data.data.scopes.indexOf(perm) < 0){
								account.hasAccess = false;
							}
						});
					}
				} 
				
				return account;
			},function(err){
				console.log(err);
			});
	}
	
	$rootScope.displayInaccessibleFacebookWarning = function(facebookAccounts){
		var verifiedAccessArray = [];
		facebookAccounts.forEach(function(account){
			var verification = $rootScope.verifyAccess(account);
			verifiedAccessArray.push(verification);
		})
		
		$q.all(verifiedAccessArray)
			.then(function(vals){
				var inaccessibleAccounts = [];
				vals.forEach(function(val){
					if(!val.hasAccess){
						inaccessibleAccounts.push(val);
					}
				});
				
				if(inaccessibleAccounts.length){
					var modalInstance = $uibModal.open({
						templateUrl: '/assets/partials/social/access-error-modal.html',
						controller: function($scope, $modalInstance, pages){
							$scope.close = function(){
								$modalInstance.dismiss();
							};
							
							$scope.pages = pages;
						},
						resolve: {
							pages: function () {
								return inaccessibleAccounts;
							}
						}
					});

					//handle the window close events
					modalInstance.result.then(function (retObj) {}, function () {
						//log that we closed the window
						console.log('Modal dismissed at: ' + new Date());
					});
				}
			});
	}
			
	$rootScope.displayInvalidGoogleCredentialsWarning = function(){
		$http.get(LOOPBACK_DOMAIN + '/api/Settings?filter[where][settingKey][like]=google_%&filter[where][organizationId]=' + currentUser.organizationId)
			.then(function(res){
				if(res.data.length == 1 && res.data[0].settingKey == "google_analytics_profile"){
					var googleModalInstance = $uibModal.open({
						templateUrl: '/assets/partials/google/access-error-modal.html',
						controller: function($scope, $modalInstance){
							$scope.close = function(){
								$modalInstance.dismiss();
							};
						}
					});
				
					//handle the window close events
					googleModalInstance.result.then(function (retObj) {}, function () {
						//log that we closed the window
						console.log('Modal dismissed at: ' + new Date());
					});
				}
			}, function(err){
				console.log('err', err)
			})
	}
	
	
	$rootScope.currentUser = currentUser;
	//set up a list of child organizations
	$rootScope.availableOrganizations = [];
	if (currentUser && currentUser.availableOrganizations.length) {
		$rootScope.availableOrganizations.push({
			id: currentUser.userOrganizationId,
			name: "org " + currentUser.userOrganizationId,
			current: currentUser.userOrganizationId == currentUser.organizationId
		})
		$rootScope.availableOrganizations = $rootScope.availableOrganizations
												.concat(currentUser.availableOrganizations.map(function(o){
													return {id: o, name: "org " + o, current: o == currentUser.organizationId}
												}));
	}

	$rootScope.getFacebookPageConfigs = function(){
		var result = $q.defer();

		var settingsParam = { where:
								{ and: [
									{ settingKey: { like: 'facebook_%' } },
									{ organizationId: currentUser.organizationId }
								]}
							};

		$http.get(LOOPBACK_DOMAIN + '/api/Settings?filter=' + encodeURI(JSON.stringify(settingsParam)))
			.then(function(data){
				result.resolve(processConfigs(data.data, FACEBOOK_NUM_CONFIGS));
			});

		return result.promise;
	};

	$rootScope.getTwitterConfigs = function(){
		var result = $q.defer();

		var settingsParam = { where:
								{ and: [
									{ settingKey: { like: 'twitter_%' } },
									{ organizationId: currentUser.organizationId }
								]}
							}

		$http.get(LOOPBACK_DOMAIN + '/api/Settings?filter=' + encodeURI(JSON.stringify(settingsParam)))
			.then(function(data){
				result.resolve(processConfigs(data.data, TWITTER_NUM_CONFIGS));
			});

		return result.promise;
	};

	$rootScope.getInstagramConfigs = function(){
		var result = $q.defer();

		var settingsParam = { where:
								{ and: [
									{ settingKey: { like: 'instagram_%' } },
									{ organizationId: currentUser.organizationId }
								]}
							}

		$http.get(LOOPBACK_DOMAIN + '/api/Settings?filter=' + encodeURI(JSON.stringify(settingsParam)))
			.then(function(data){
				result.resolve(processConfigs(data.data, INSTAGRAM_NUM_CONFIGS));
			});

		return result.promise;
	}

	$rootScope.getRealOrgNames = function() {
		var search = {filter: {
			where: {id: {inq: $rootScope.availableOrganizations.map(function(o){return o.id})}},
			fields: ['id', 'clientName']
		}};
		$http.get(LOOPBACK_DOMAIN + '/api/Organizations', {headers: { 'Content-Type': 'application/json' }, params: search})
			.then(function(r){
				$rootScope.availableOrganizations.forEach(function(o){
					var foundVal = r.data.filter(function(i){return i.id == o.id});
					if(foundVal && foundVal.length){
						o.name = foundVal[0].clientName;
					}
				});
			})
	}

	$rootScope.switchOrganization = function(org) {
		$http.post('/settings/organizations/' + org.id + '/spoof')
			.success(function(resp){
				console.log(resp);
				flashMessenger.showMessage("You are now logged in as the organization '" + org.name + "'. ", "success", 1000);
				$timeout(function(){
					$window.location.reload();
				}, 1000);
			})

	}

	$rootScope.isInProduction = new RegExp("app.restaurant-logic.com").test($window.location.host);
})
.service('LoopbackSearchService', ['$http', '$timeout', '$q', function($http, $timeout, $q){

	var timeout = null;

	var searchService = {
		
		/* 
		 * This is just a list of properties needed for the search service to work.
		 * We don't want to maintain this obj in the service, as this breaks the
		 * rule of statelessness for services.
		 * 
			var searchProps = {
				model: "",
				searchFields: [],
				where: {},
				include: null,
				searchValue: "",
				order: [],
				pagination: { current: 1, totalItems: 0, itemsPerPage: 10 },
				loadingOverlay: null;
			}
		*/


		getPage: function(searchObj, timeoutMs){
			var timeoutLength = timeoutMs || 1500; //Default timeout length in milliseconds
			
			if (searchObj.loadingOverlay) {
				searchObj.loadingOverlay.show();
			}

			if(timeout){
				$timeout.cancel(timeout);
			}

			var resultPromise = $q.defer();

			//queue a save request to run in the future
			timeout = $timeout(function(){
				//if we have an overlay, show it

				// Copy the where clause so we can inject the orConditions without
				// modifying the original where clause
				var serviceWhere = angular.copy(searchObj.where);
				
				var orConditions = {or:[]};
				
				// If the search value is non-blank, process it
				if(searchObj.searchValue.length > 0 && searchObj.searchFields.length > 0){
					var searchStr = '%' + searchObj.searchValue + '%';

					// For every search field, insert the search string as a 'like' condition
					searchObj.searchFields.forEach(function(field){
						var fieldObj = {};
						// TODO another forEach searchStr here?
						fieldObj[field] = {like: searchStr};
						orConditions.or.push(fieldObj);
					});

					serviceWhere.and.push(orConditions);
				}


				var filter = {
					where: serviceWhere,
					limit: searchObj.pagination.itemsPerPage,
					skip: ((searchObj.pagination.current -1) * searchObj.pagination.itemsPerPage)
				}
				// Only include the order property if it exists
				if(searchObj.order && searchObj.order.length){
					filter.order = searchObj.order;
				}
				
				if(searchObj.include){
					filter.include = searchObj.include;
				}

				// Search for results
				$http.get(LOOPBACK_DOMAIN + "/api/" + searchObj.model, {
						params:{
							filter: filter
						}
					})
					.then(function(res, status, headers, config){
						if (searchObj.loadingOverlay) {
							searchObj.loadingOverlay.hide();
						}
						
						resultPromise.resolve(res.data);
					}, function(err){
						console.log(err);
						resultPromise.reject(err);
					});

				// Get the new count of total objects
				$http.get(LOOPBACK_DOMAIN + "/api/" + searchObj.model + "/count", {
						params:{
							where: serviceWhere
						}
					})
					.then(function(res, status, headers, config){
						searchObj.pagination.totalItems = res.data.count;
					}, function(data,status,headers,config){
						console.log(data);
					});
			}, timeoutLength);
			
			return resultPromise.promise;
		}
	};

	return searchService;
}])
.directive('customDatetimepicker', function($timeout, $filter){
	return {
		restrict: 'E',
		scope: {
			itemDatetime: '=itemDatetime',
			datetimeInputId: '=datetimeInputId',
			showQuickButtons: '=showQuickButtons',
			dateFormat: '=dateFormat',
			noBackDate: '=noBackDate',
			disableKeyboardInput: '=disableKeyboardInput'
		},
		templateUrl: "/assets/partials/custom-datetimepicker.html",
		link: function(scope, element, attrs) {
			
			if(typeof scope.dateFormat == "undefined" || scope.dateFormat == ""){
				scope.dateFormat = 'datetime';
			}
			
			var pickerStartDate = null;
			if(typeof scope.noBackDate != "undefined" && scope.noBackDate){
				pickerStartDate = new Date();
			}
			
			
			var DATETIME_FORMAT = 'MM/dd/yyyy, hh:mm a';
			var DATE_FORMAT = 'MM/dd/yyyy';
			var LONGDATE_FORMAT = 'MMM d, y';
			
			var PICKER_DATETIME_FORMAT = 'mm/dd/yyyy, HH:ii P';
			var PICKER_DATE_FORMAT = 'mm/dd/yyyy';
			var PICKER_LONGDATE_FORMAT = 'M d, yyyy';
		
			var formatToUse = DATETIME_FORMAT;
			var pickerFormatToUse = PICKER_DATETIME_FORMAT;
			var pickerMinView = 0;
			

			switch(scope.dateFormat){
				case 'datetime':
					// Already set to datetime format
					break;
				case 'longdate':
					formatToUse = LONGDATE_FORMAT;
					pickerFormatToUse = PICKER_LONGDATE_FORMAT;
					pickerMinView = 2;
					break;
				case 'date':
					formatToUse = DATE_FORMAT;
					pickerFormatToUse = PICKER_DATE_FORMAT;
					pickerMinView = 2;
					break;
			}

			scope.addTime = function(timeToAdd){
				if(typeof scope.itemDatetime != "undefined" && scope.itemDatetime != ""){
					scope.itemDatetime = (new Date(scope.itemDatetime.getTime() + timeToAdd));
				} else {
					scope.itemDatetime = (new Date((new Date()).getTime() + timeToAdd));
				}
			}
			
			scope.setNow = function() {
				scope.itemDatetime = (new Date());
			}
			
			scope.clearTime = function(){
				scope.itemDatetime = "";
			}
			
			scope.$watch('itemDatetime', function(newValue, oldValue){
				if(newValue == oldValue) return;
				
				jQuery('.datetimepicker .' + scope.datetimeInputId, element).val($filter('date')(newValue,formatToUse)).datetimepicker('update');
			})
			
			$timeout(function(){
				//For documentation, check here: http://www.malot.fr/bootstrap-datetimepicker/
				if(typeof jQuery().datetimepicker == 'function'){
					jQuery('.datetimepicker .' + scope.datetimeInputId, element).datetimepicker({
						format: pickerFormatToUse,
						autoclose: true,
						container: jQuery('.datetimepicker', element),
						showMeridian: true,
						minView: pickerMinView,
						startDate: pickerStartDate
					}).on('changeDate', function(ev){
						scope.$apply(function(){
							scope.itemDatetime = new Date(ev.date.getTime() + ev.date.getTimezoneOffset() * 60000);
						});
					});
					jQuery('.datetimepicker .' + scope.datetimeInputId, element).val($filter('date')(scope.itemDatetime,formatToUse)).datetimepicker('update');
				}
			});
			
		}
	}
	
});
