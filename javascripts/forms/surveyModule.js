(function() {
	angular.module('builder.surveyComponents', ['builder', 'validator.rules', 'ui.bootstrap']).config(['$builderProvider',
		function($builderProvider) {
			$builderProvider.registerComponent('starRating', {
                        			group: 'Survey',
                        			label: 'Star Rating',
                        			description: '',
                        			validation: "[rating]",
                        			required: true,
                        			placeholder: 'How would you rate this',
                        			template: "<div class='form-group star-component'>"+
                        				"	<label class='col-md-4 control-label' for='{{formName+index}}' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
                        				"	<div class='col-md-8'>" +
                        				"               <uib-rating max='5' ng-model='inputText' readonly='false' id='{{formName+index}}'></uib-rating>" +
                        				"               <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>" +
                        				"               <p class='help-block'>{{description}}</p>" +
                        				"       </div>" +
                        				"</div>",
                        			popoverTemplate: "<form>\
                        			                        <div class='form-group'>\
                        			                                <label class='control-label'>Label</label>\
                        			                                <input type='text' ng-model='label' validator='[required]' class='form-control'/>\
									</div>\
									<div class='form-group'>\
                                                                                <label class='control-label'>Description</label>\
                                                                                <input type='text' ng-model='description' class='form-control'/>\
                                                                        </div>\
                                                                        <div class='checkbox'> \
                                                                                <label><input type='checkbox' ng-model='required' />Required</label> \
                                                                        </div> \
                                                                        <!--div class='form-group'>\
                                                                                <label class='control-label'>Number of stars {{numStars}}</label>\
                                                                                <select class='form-control' ng-model='numStars'>\
                                                                                        <option>5</option> \
                                                                                        <option>10</option> \
                                                                        </div-->\
									<hr/>\
									<div class='form-group'>\
										<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
										<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
										<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
									</div>\
								</form>"
                        		});
			$builderProvider.registerComponent('overallRating', {
                        			group: 'Survey',
                        			label: 'Overall Satisfaction',
                        			description: 'Overall, how satisfied were you?',
                        			validation: "[rating]",
                        			placeholder: 'Overall, how satisfied were you?',
						inputName: 'survey_overall_rating',
						required: true,
						unique: true,
                        			template: "<div class='form-group star-component'>"+
                        				"	<label class='col-md-4 control-label' for='survey_overall_rating' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
                        				"	<div class='col-md-8'>" +
                        				"               <uib-rating max='5' ng-model='inputText' readonly='false' id='survey_overall_rating'></uib-rating>" +
                        				"               <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>" +
                        				"               <p class='help-block'>{{description}}</p>" +
                        				"       </div>" +
                        				"</div>",
                        			popoverTemplate: "<form>\
                        			                        <div class='form-group'>\
                        			                                <label class='control-label'>Label</label>\
                        			                                <input type='text' ng-model='label' validator='[required]' class='form-control'/>\
									</div>\
									<div class='form-group'>\
                                                                                <label class='control-label'>Description</label>\
                                                                                <input type='text' ng-model='description' class='form-control'/>\
                                                                        </div>\
									<hr/>\
									<div class='form-group'>\
										<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
										<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
									</div>\
								</form>"
                        		});
		$builderProvider.registerComponent('visitTime', {
				group: 'Survey',
				label: 'Visit Time',
				description: '',
				inputName: 'survey_visit_time',
				validation: '[date-time]',
				placeholder: 'Date and time of visit (MM/dd/yyyy, hh:mm meridian)',
				unique: true,
				template: "<div class='form-group datepicker'>"+
					"       <label for='survey_visit_time' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
					"       <div class='col-md-8'>" +
					"        <input type='text' ng-model='inputText' validator-required='{{required}}' " +
					"                       model-view-value='true' ui-mask='99/99/9999, 99:99 AA' " +
					"                       ui-mask-placeholder ui-mask-placeholder-char='_' " +
					"                       validator-group='{{formName}}' name='survey_visit_time' id='survey_visit_time'" +
					"			 class='form-control' placeholder='{{placeholder}}'/>" +
					"        <p class='help-block'>{{description}}</p>" +
					"    </div>" +
					"</div>",
				popoverTemplate: "<form>\
							<div class='form-group'>\
								<label class='control-label'>Label</label>\
								<input type='text' ng-model='label' validator='[required]' class='form-control'/>\
							</div>\
							<div class='form-group'>\
								<label class='control-label'>Description</label>\
								<input type='text' ng-model='description' class='form-control'/>\
							</div>\
							<div class='form-group'>\
								<label class='control-label'>Placeholder</label>\
								<input type='text' ng-model='placeholder' class='form-control'/>\
							</div>\
							<div class=\"checkbox\">\
								<label>\
									<input type=\'checkbox\' ng-model=\"required\" /> Required\
								</label>\
							</div>\
							<hr/>\
							<div class='form-group'>\
								<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
								<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
								<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
							</div>\
						</form>"
			});
			$builderProvider.registerComponent('visitFrequency', {
				group: 'Survey',
				label: 'How frequently do you visit?',
				description: '',
				inputName: 'survey_visit_frequency',
				placeholder: 'frequency of visit',
				unique: true,
				options: ["First Time", "Once a month", "Twice a month", "Four times a month+"],
				template: "<div class='form-group'>"+
					"	<label for='survey_visit_frequency' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<select ng-options='value for value in options' id='survey_visit_frequency' class='form-control' " +
					"				ng-model='inputText' ng-init='inputText = options[0]'/>" +
					"        <p class='help-block'>{{description}}</p>" +
					"    </div>" +
					"</div>",
				popoverTemplate: "<form>\
							<div class='form-group'>\
								<label class='control-label'>Label</label>\
								<input type='text' ng-model='label' validator='[required]' class='form-control'/>\
							</div>\
							<div class='form-group'>\
								<label class='control-label'>Description</label>\
								<input type='text' ng-model='description' class='form-control'/>\
							</div>\
							<div class='form-group'>\
								<label class='control-label'>Options</label>\
								<textarea class='form-control' rows='4' ng-model='optionsText'/>\
								<p class='help-block'>NOTE: Do NOT remove the 'First Time' option. This is required in order for us to provide you accurate results on your survey statistics.</p>\
							</div>\
							<hr/>\
							<div class='form-group'>\
								<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
								<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
								<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
							</div>\
						</form>"
				//check this
				//if(optionsText.indexOf(\"First Time\") == -1) optionsText+=\"First Time\";
			});
			$builderProvider.registerComponent('managerContact', {
				group: 'Survey',
				label: 'Do you want a manager to contact you?',
				description: '',
				inputName: 'survey_manager_contact',
				placeholder: '',
				unique: true,
				template: "<div class=\"form-group\">\n    " +
							"	<label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    " +
							"	<div class=\"col-md-8\">\n" +
							"		<div class='radio'>\n" +
							"			<label><input value='Yes' type='radio' ng-model='showManagerFields'/>Yes</label>\n" +
							"		</div>\n" +
							"		<div class='radio'>\n" +
							"			<label><input value='No' type='radio' ng-model='showManagerFields'/>No</label>\n" +
							"		</div>\n" +
							"		<div ng-show='showManagerFields == \"Yes\"'>" +
							"			<div class='form-group'>" +
							"				<div class='col-xs-12'>" +
							"					<label class='control-label'>Email Address</label>" +
							"					<input type='text' ng-model='contactEmail' class='form-control' ng-init='contactEmail=\"\"' validator='[email]' " +
							"						ng-change='inputText=(contactEmail && contactEmail.trim().length > 0 ? \"Email Address: \" + contactEmail : \"\") + (contactPhone && contactPhone.trim().length > 0 ? \" Phone Number: \" + contactPhone : \"\")'/>" +
							"				</div>" +
							"			</div>" +
							"			<div class='form-group'>" +
							"				<div class='col-xs-12'>" +
							"					<label class='control-label'>Phone Number</label>" +
							"					<input type='text' ng-model='contactPhone' class='form-control' ng-init='contactPhone=\"\"' validator='[phone]'" +
							"						ng-change='inputText=(contactEmail && contactEmail.trim().length > 0 ? \"Email Address: \" + contactEmail : \"\") + (contactPhone && contactPhone.trim().length > 0 ? \" Phone Number: \" + contactPhone : \"\")'/>" +
							"				</div>" +
							"			</div>" +
							"		</div>\n" +
							"		<p class='help-block'>{{description}}</p>\n" +
							"	</div>\n" +
							"</div>",
				popoverTemplate: "<form>\
							<div class='form-group'>\
								<label class='control-label'>Label</label>\
								<input type='text' ng-model='label' validator='[required]' class='form-control'/>\
							</div>\
							<div class='form-group'>\
								<label class='control-label'>Description</label>\
								<input type='text' ng-model='description' class='form-control'/>\
							</div>\
							<hr/>\
							<div class='form-group'>\
								<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
								<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
								<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
							</div>\
						</form>"
				//check this
				//if(optionsText.indexOf(\"First Time\") == -1) optionsText+=\"First Time\";
			});
		}
	]);
}).call(this);
