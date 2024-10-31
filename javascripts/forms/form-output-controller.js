jQuery(function($){
	var appName = 'app' + Math.random();
	var LOOPBACK_DOMAIN = 'https://api.restaurant-logic.com';

	var appModule = angular.module(appName, ['builder', 'builder.components', 'builder.customerComponents', 'builder.surveyComponents', 'builder.jobAppComponents', 'validator.rules', 'ngSanitize', 'ui.mask'], function($locationProvider) {

		$locationProvider.html5Mode({
			//enabled: true,
			requireBase: false
		});
	});
	
	appModule.factory('formDataService', ['$q', '$location', function($q, $location){
		var url = $location.absUrl();
		var data = url.substring(url.indexOf('?') + 1).split('&').map(function (elem) {
			var elems = elem.split('=');
			return {name: elems[0], value: decodeURIComponent(elems[1])}
		}).reduce(function (cur, elem) {
			if (cur[elem.name]) {
				if (Array.isArray(cur[elem.name])) {
					cur[elem.name].push(elem.value)
				} else {
					cur[elem.name] = [cur[elem.name], elem.value]
				}
			} else {
				cur[elem.name] = elem.value;
			}
			return cur;
		}, {});
	
		return {
			getData : function(){
				var deferred = $q.defer();
	
				deferred.resolve(data);
	
				return deferred.promise;
			},
	
			getDataForField : function(field){
				return data[field] || null;
			}
		};
	}]);
	appModule.controller('FormOutputController', function($scope, $builder, $timeout, $validator, $http, $attrs, formDataService) {
		$scope.formData = {};
		$scope.existingForm = {};
		$scope.pagination = {};
		$scope.pagination.currentPage = 0;
		$scope.pagination.startIndex = 0;
		$scope.pagination.endIndex = 0;
		$scope.pagination.pageIndexes = [0];
		$scope.processLocation = null;
		$scope.locations = [];
		$scope.customerGroups = {};
	
		$scope.dateFields = [];
	
		$timeout(function(){
			$http.get(LOOPBACK_DOMAIN + '/api/Forms/' + $attrs.formId)
				.success(function(resp){
	
					$scope.formData = resp;
					$scope.existingForm = $.parseJSON($scope.formData.structure);
					$scope.pagination.pageIndexes = [0];
	
					formDataService.getData().then(function(existingFormValues){
						$scope.existingForm.filter(function(f){return f.inputName}).forEach(function (field) {
							var fieldValue = existingFormValues[field.inputName];
							if (fieldValue) {
								field.defaultValues = {};
								//TODO extend for survey
								if (['text', 'customerFirstname', 'customerLastname', 'customerBirthday', 'customerPhone', 'customerAddress', 'customerCity', 'customerState', 'customerZip'].indexOf(field.component) > 0) {
									field.defaultValues.inputText = fieldValue
								} else if (field.component === 'customerEmail') {
									field.defaultValues.subscribeEmail = 'Yes';
									field.defaultValues.emailAddress = fieldValue;
									field.defaultValues.inputText = fieldValue + '||Yes';
								}
							}
						});
	
						var queryParam = { where: { or: [
								{ ancestor1Id: $scope.formData.organizationId },
								{ ancestor2Id: $scope.formData.organizationId },
								{ ancestor3Id: $scope.formData.organizationId }
							]}};
	
						var childLocationsPromise = $http.get(LOOPBACK_DOMAIN + '/api/Organizations?filter=' + JSON.stringify(queryParam))
							.then(function(resp){
								if(resp.data != null && resp.data.error == null && resp.data.length > 0){
									resp.data.forEach(function(location){
										$scope.locations.push({id: location.id, name: location.clientName});
									})
								}
							});
	
						// When child locations have been processed, then start processing form components;
						childLocationsPromise.then(function(){
							$scope.buildAndProcessFormComponents();
						});
	
						$scope.formData.customerId = getUrlParameter('customerId') || '0';
	
					});
				});
		});
		
		$scope.loadCustomerGroups = function(organizationId){
			if(typeof organizationId != "number" || !$scope.processCustomerGroups) return; 
			$scope.existingForm[$scope.processCustomerGroups].options.length = 0;
			
			// This broadcast shoots a message to child scopes (the angular-form-builder), 
			// which the fbFormObject directive will catch, and will appropriately
			// wipe the inputArray if the component is the customerGroups component
			$scope.$broadcast("customerGroupsChanged", {});
	
			$scope.customerGroups[organizationId].forEach(function(groupId){
				$scope.existingForm[$scope.processCustomerGroups].options.push(groupId);
			})		
		}
	
		$scope.managerContactFields = {};
		$scope.buildAndProcessFormComponents = function(isResetForm){
			isResetForm = isResetForm || false;
			for(var i = 0; i < $scope.existingForm.length; i++){
				if($scope.existingForm[i].component == "pageBreak"){
					$scope.pagination.pageIndexes.push(i);
					
					
				} else if($scope.existingForm[i].component == "location"){
					if(!isResetForm){ 
						$scope.processLocation = i;
						
						$scope.existingForm[$scope.processLocation].options.push({id: "", name: ""});
						
						$scope.locations.forEach(function(location){
							$scope.existingForm[$scope.processLocation].options.push(location);
						});
						
						$scope.$watch('input[processLocation].value', function(newVal, oldVal){
							if(newVal == ""){
								newVal = $scope.formData.organizationId;
							}
							$scope.loadCustomerGroups(newVal);
						});
					}
				} else if($scope.existingForm[i].component == "customerEmail"){
					$scope.managerContactFields.customerEmailIndex = i;
				} else if($scope.existingForm[i].component == "customerPhone"){
					$scope.managerContactFields.customerPhoneIndex = i;
				} else if($scope.existingForm[i].component == "customerGroups"){
					$scope.processCustomerGroups = i;
					
					var childOrgIds = $scope.locations.map(function(location){
						return location.id;
					});
					
					$scope.customerGroups[$scope.formData.organizationId] = [];
					childOrgIds.forEach(function(childOrgId){
						$scope.customerGroups[childOrgId] = [];
					})
					
					var queryParam = {where: {organizationId: {inq: childOrgIds.concat($scope.formData.organizationId)}, type: "signup" }};
				
					$http.get(LOOPBACK_DOMAIN + "/api/Groups?filter=" + JSON.stringify(queryParam))
						.then(function(resp){
							var groups = resp.data;
							
							groups.forEach(function(group){
								$scope.customerGroups[group.organizationId].push({value: group.id, name: group.name});
							});
							$scope.loadCustomerGroups($scope.formData.organizationId);
						});
				} else if($scope.existingForm[i].component == "customerState"){
					if(!isResetForm){
						Array.prototype.push.apply($scope.existingForm[i].options, [{name:"Alabama (AL)",value:"AL"},{name:"Alaska (AK)",value:"AK"},{name:"Alberta (AB)",value:"AB"},{name:"Arizona (AZ)",value:"AZ"},{name:"Arkansas (AR)",value:"AR"},{name:"British Columbia (BC)",value:"BC"},{name:"California (CA)",value:"CA"},{name:"Colorado (CO)",value:"CO"},{name:"Connecticut (CT)",value:"CT"},{name:"Dist. Columbia (DC)",value:"DC"},{name:"Delaware (DE)",value:"DE"},{name:"Florida (FL)",value:"FL"},{name:"Georgia (GA)",value:"GA"},{name:"Hawaii (HI)",value:"HI"},{name:"Idaho (ID)",value:"ID"},{name:"Illinois (IL)",value:"IL"},{name:"Indiana (IN)",value:"IN"},{name:"Iowa (IA)",value:"IA"},{name:"Kansas (KS)",value:"KS"},{name:"Kentucky (KY)",value:"KY"},{name:"Labrador (LB)",value:"LB"},{name:"Louisiana (LA)",value:"LA"},{name:"Maine (ME)",value:"ME"},{name:"Manitoba (MB)",value:"MB"},{name:"Maryland (MD)",value:"MD"},{name:"Massachusetts (MA)",value:"MA"},{name:"Michigan (MI)",value:"MI"},{name:"Minnesota (MN)",value:"MN"},{name:"Mississippi (MS)",value:"MS"},{name:"Missouri (MO)",value:"MO"},{name:"Montana (MT)",value:"MT"},{name:"Nebraska (NE)",value:"NE"},{name:"Nevada (NV)",value:"NV"},{name:"New Brunswick (NB)",value:"NB"},{name:"New Hampshire (NH)",value:"NH"},{name:"New Jersey (NJ)",value:"NJ"},{name:"New Mexico (NM)",value:"NM"},{name:"New York (NY)",value:"NY"},{name:"Newfoundland (NF)",value:"NF"},{name:"North Carolina (NC)",value:"NC"},{name:"North Dakota (ND)",value:"ND"},{name:"North West Terr. (NW)",value:"NW"},{name:"Nova Scotia (NS)",value:"NS"},{name:"Nunavut (NU)",value:"NU"},{name:"Ohio (OH)",value:"OH"},{name:"Oklahoma (OK)",value:"OK"},{name:"Ontario (ON)",value:"ON"},{name:"Oregon (OR)",value:"OR"},{name:"Pennsylvania (PA)",value:"PA"},{name:"Prince Edward Is. (PE)",value:"PE"},{name:"Quebec (QC)",value:"QC"},{name:"Rhode Island (RI)",value:"RI"},{name:"Saskatchewen (SK)",value:"SK"},{name:"South Carolina (SC)",value:"SC"},{name:"South Dakota (SD)",value:"SD"},{name:"Tennessee (TN)",value:"TN"},{name:"Texas (TX)",value:"TX"},{name:"Utah (UT)",value:"UT"},{name:"Vermont (VT)",value:"VT"},{name:"Virginia (VA)",value:"VA"},{name:"Washington (WA)",value:"WA"},{name:"West Virginia (WV)",value:"WV"},{name:"Wisconsin (WI)",value:"WI"},{name:"Wyoming (WY)",value:"WY"},{name:"Yukon (YU)",value:"YU"}]);
					}
				} else if($scope.existingForm[i].component == "datePicker"){
					if(!isResetForm){
						if($scope.existingForm[i].validation == "[date]"){
							$scope.dateFields.push({index:i,type:"date"});
						} else {
							$scope.dateFields.push({index:i,type:"date-time"});
						}
					}
				}
				$builder.addFormObject('default', $scope.existingForm[i]);
			}
	
			$scope.pagination.startIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage];
	
			// If we're on the last page, then just return the form length as the end index.
			// Else, return the proper end index based on the next page's first index
			if($scope.pagination.currentPage + 1 >= $scope.pagination.pageIndexes.length){
				$scope.pagination.endIndex = $scope.existingForm.length;
			} else {
				$scope.pagination.endIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage +1];
			}
	
			for(var i = $scope.pagination.endIndex; i < $scope.form.length; i++){
				$scope.form[i].validation = "/.*/";
				$scope.form[i].required = false;
			}
	
			$timeout(function(){
				if($attrs.bootstrapless){
					return;
				}
	
				//For documentation, check here: http://www.malot.fr/bootstrap-datetimepicker/
				$("#survey_visit_time").datetimepicker({
					format:"mm/dd/yyyy, HH:ii P",
					autoclose: true,
					todayBtn: true,
					container: $("#survey_visit_time").closest('.form-group'),
					showMeridian: true
				});
				
				$("#customer_birthday").datetimepicker({
					format: "mm/dd/yyyy",
					container: $("#customer_birthday").closest('.form-group'),
					autoclose: true,
					minView: 2,
					startView: 4,
					pickerPosition: 'bottom-left'
				});
				
				$("#customer_anniversary").datetimepicker({
					format: "mm/dd/yyyy",
					container: $("#customer_anniversary").closest('.form-group'),
					autoclose: true,
					minView: 2,
					startView: 4,
					pickerPosition: 'bottom-left'
				});
				
				$scope.dateFields.forEach(function(dateField){				
					if(dateField.type == "date-time"){
						$("#default" + dateField.index).datetimepicker({
							format:"mm/dd/yyyy, HH:ii P",
							autoclose: true,
							todayBtn: true,
							container: $("#default" + dateField.index).closest('.form-group'),
							pickerPosition: 'bottom-left',
							showMeridian: true
						});
					} else {
						$("#default" + dateField.index).datetimepicker({
							format:"mm/dd/yyyy",
							autoclose: true,
							todayBtn: true,
							minView: 2,
							startView: 4,
							container: $("#default" + dateField.index).closest('.form-group'),
							pickerPosition: 'bottom-left'
						});
					}
				});
			}, 300);
		}
		
		$scope.$on('managerContactYes',function(event,data){
			var emailPhoneData = {};
			if($scope.managerContactFields.customerEmailIndex){
				emailPhoneData.email = $scope.input[$scope.managerContactFields.customerEmailIndex].value;
			}
			if($scope.managerContactFields.customerPhoneIndex){
				emailPhoneData.phone = $scope.input[$scope.managerContactFields.customerPhoneIndex].value;
			}
			
			if(Object.keys(emailPhoneData).length){
				$scope.$broadcast('contactFieldsFilled', emailPhoneData);
			}
		});
		
		$scope.getResponseValue = function(component){
			return (!component.value || !component.value.length) ? "-" : component.value;
		}
	
	
		$scope.form = $builder.forms['default'];
		$scope.input = [];
		$scope.defaultValue = {};
	
		$scope.next = function(){
	
			$validator.validate($scope, 'default')
				.success(function() {
					$scope.pagination.currentPage++;
					// If we're on the last page, then just return the form length as the end index.
					// Else, return the proper end index based on the next page's first index
					$scope.pagination.startIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage];
	
					if($scope.pagination.currentPage + 1 >= $scope.pagination.pageIndexes.length){
						$scope.pagination.endIndex = $scope.existingForm.length;
					} else {
						$scope.pagination.endIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage +1];
					}
	
					for(var i = $scope.pagination.startIndex; i < $scope.pagination.endIndex; i++){
						$scope.form[i].validation = $scope.existingForm[i].validation;
						$scope.form[i].required = $scope.existingForm[i].required;
					}
				}).error(function() {
					return console.log('error');
				});
		}
	
		$scope.prev = function(){
			$scope.pagination.currentPage--;
			$scope.pagination.startIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage];
	
			if($scope.pagination.currentPage + 1 >= $scope.pagination.pageIndexes.length){
				$scope.pagination.endIndex = $scope.existingForm.length;
			} else {
				$scope.pagination.endIndex = $scope.pagination.pageIndexes[$scope.pagination.currentPage +1];
			}
	
			for(var i = $scope.pagination.endIndex; i < $scope.form.length; i++){
				$scope.form[i].validation = "/.*/";
				$scope.form[i].required = false;
			}
		}
	
		$scope.formNavigationHook = function(nextFormId, customerId){
			$.get(LOOPBACK_DOMAIN + "/api/Forms/" + nextFormId,
				function(response){
					$scope.formData = response;
					$scope.existingForm = $.parseJSON($scope.formData.structure);
					$scope.formData.customerId = customerId;
	
					$scope.pagination = {};
					$scope.pagination.currentPage = 0;
					$scope.pagination.startIndex = 0;
					$scope.pagination.endIndex = 0;
					$scope.pagination.pageIndexes = [0];
	
					while($builder.forms['default'].length > 0){
						$builder.removeFormObject("default", 0)
					}
	
					$scope.buildAndProcessFormComponents();
	
					$scope.$apply();
				});
		}
	
		$scope.submit = function() {
			return $validator.validate($scope, 'default').success(function() {
				var formResetOrganizationId = $scope.formData.organizationId;
				if($scope.processLocation != null && typeof $scope.processLocation == 'number'){
					if($scope.input[$scope.processLocation].value != ""){
						$scope.formData.organizationId = $scope.input[$scope.processLocation].value;
						
						$scope.locations.forEach(function(location){
							if(location.id == $scope.input[$scope.processLocation].value){
								$scope.input[$scope.processLocation].value = location;
							}
						});
					}
				}
				if($scope.processCustomerGroups){
					if($scope.input[$scope.processCustomerGroups].value != ""){
						var selectedGroups = $scope.input[$scope.processCustomerGroups].value.split(",").map(function(selectedGroup){ return ~~selectedGroup; });
						var processedInput = [];
						$scope.customerGroups[$scope.formData.organizationId].forEach(function(customerGroup){
							if(selectedGroups.indexOf(customerGroup.value) >= 0){
								processedInput.push(customerGroup);
							}
						});
						
						$scope.input[$scope.processCustomerGroups].value = processedInput;
					}
				}
				
	
				$.post(LOOPBACK_DOMAIN + '/api/FormResponses',
					{
						'id' : 0,
						'organizationId' : $scope.formData.organizationId,
						'formId' : $scope.formData.id,
						'customerId' : $scope.formData.customerId,
						'responseContent' : angular.toJson($scope.input),
						'createTime' : (new Date),
						'sourceType' :  $scope.formData.type,
						'recaptchaResponse' : angular.element('#recaptcha-' + $scope.formData.id + ' div textarea').val()
					},
					function(response){
						//console.log(response);
						
						if(response.nextFormId){
							$scope.formNavigationHook(response.nextFormId, response.customerId);
							$('.form-pagination-' + $scope.formData.id).hide();
						} else if($scope.formData.echoResponses == 1){
							$('.form-content-' + $scope.formData.id).hide().after('<p class="complete-message no-print">' + ($scope.formData.completeMessage ? $scope.formData.completeMessage : 'Thanks for your input.') + '</p>');
							$('.form-echo-response-' + $scope.formData.id).show();
							$('.form-pagination-' + $scope.formData.id).hide();
						} else if($scope.formData.resetOnComplete == 1){
							if($scope.formData.captchaEnabled){
								recaptchaForms.forEach(function(recaptchaForm){
									if(recaptchaForm.id == $scope.formData.id){
										grecaptcha.reset(recaptchaForm.recaptchaId);
									}
								})
							}
							
							$scope.formData.organizationId = formResetOrganizationId;
							$scope.resetForm();
							
							$('.form-content-' + $scope.formData.id).before('<p class="complete-message-' + $scope.formData.id + '">' + ($scope.formData.completeMessage ? $scope.formData.completeMessage : 'Thanks for your input.') + '</p>');
							$timeout(function(){
								$('.complete-message-'+ $scope.formData.id).remove();
							}, 10000)
						} else {
							$('.form-content-' + $scope.formData.id).hide().after('<p class="complete-message">' + ($scope.formData.completeMessage ? $scope.formData.completeMessage : 'Thanks for your input.') + '</p>');
							$('.form-pagination-' + $scope.formData.id).hide();
						}
						
					}
				).fail(function(response){
					console.log(response.responseText);
				});
	
			}).error(function() {
				return console.log('error');
			});
		};
	
		$scope.resetForm = function(){
			// To reset the form cleanly, we need to nuke it and rebuild
			// Trying to just clear inputs results in a lot of weird behavior
			$timeout(function(){
				$scope.pagination.currentPage = 0;
				$scope.pagination.startIndex = 0;
				$scope.pagination.endIndex = 0;
				$scope.pagination.pageIndexes = [0];
				
				while($builder.forms['default'].length > 0){
					$builder.removeFormObject("default", 0)
				}
				$scope.buildAndProcessFormComponents(true);

				$scope.$apply();
			})
		}
	
	});
	
	
	var loadInterval = setInterval(function() {
		try{
			appModule.requires.forEach(function(mod){
				angular.module(mod);
			});
			
			jQuery('#form-output-container:not(.loaded)').each(function() {
				var bootStrapElement = jQuery(this);
				angular.bootstrap(bootStrapElement, [appName]);
				bootStrapElement.addClass('loaded');
			})
			
			clearInterval(loadInterval);
		} catch(e){
			console.error(e);
			//if one of these is not loaded, let the interval run again
			console.log("One of the modules hasn't loaded yet")
		}
	}, 10);

});
