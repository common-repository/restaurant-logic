(function() {
	angular.module('builder.jobAppComponents', ['builder', 'validator.rules', 'ui.bootstrap']).config(['$builderProvider',
		function($builderProvider) {
			
			var requiredTemplate = "<form> \
									<div class='form-group'> \
										<label class='control-label'>Label</label> \
										<input type='text' ng-model='label' validator='[required]' class='form-control'/> \
									</div> \
									<div class='form-group'> \
										<label class='control-label'>Description</label> \
										<input type='text' ng-model='description' class='form-control'/> \
									</div> \
									<div class='form-group'> \
										<label class='control-label'>Placeholder</label> \
										<input type='text' ng-model='placeholder' class='form-control'/> \
									</div> \
									<hr/> \
									<div class='form-group'> \
										<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/> \
										<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/> \
									</div> \
								</form>";
								
			var optionalTemplate = "<form> \
										<div class='form-group'> \
											<label class='control-label'>Label</label> \
											<input type='text' ng-model='label' validator='[required]' class='form-control'/> \
										</div> \
										<div class='form-group'> \
											<label class='control-label'>Description</label> \
											<input type='text' ng-model='description' class='form-control'/> \
										</div> \
										<div class='form-group'> \
											<label class='control-label'>Placeholder</label> \
											<input type='text' ng-model='placeholder' class='form-control'/> \
										</div> \
										<div class='checkbox'> \
											<label><input type='checkbox' ng-model='required' />Required</label> \
										</div> \
										<hr/> \
										<div class='form-group'> \
											<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/> \
											<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/> \
											<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/> \
										</div> \
									</form>";
									
			var requiredSelectTemplate = "<form> \
											<div class='form-group'> \
												<label class='control-label'>Label</label> \
												<input type='text' ng-model='label' validator='[required]' class='form-control'/> \
											</div> \
											<div class='form-group'> \
												<label class='control-label'>Description</label> \
												<input type='text' ng-model='description' class='form-control'/> \
											</div> \
											<div class='form-group'> \
												<label class='control-label'>Options</label> \
												<textarea class='form-control' rows='3' ng-model='optionsText'></textarea> \
											</div> \
											<hr/> \
											<div class='form-group'> \
												<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/> \
												<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/> \
											</div> \
										</form>";

			$builderProvider.registerComponent('jobApplicantFirstname', {
				group: 'Job Application',
				label: 'First Name',
				description: '',
				inputName: 'job_applicant_firstname',
				placeholder: 'First Name',
				required: true,
				unique: true,
				template: "<div class='form-group'>"+
					"	<label for='job_applicant_firstname' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
					"			validator-group='{{formName}}' name='job_applicant_firstname' id='job_applicant_firstname' class='form-control' placeholder='{{placeholder}}'/>" +
					"		<p class='help-block'>{{description}}</p>" +
					"	</div>" +
					"</div>",
				popoverTemplate: requiredTemplate
			});
			$builderProvider.registerComponent('jobApplicantLastname', {
				group: 'Job Application',
				label: 'Last Name',
				description: '',
				inputName: 'job_applicant_lastname',
				placeholder: 'Last Name',
				required: true,
				unique: true,
				template: "<div class='form-group'>"+
					"	<label for='job_applicant_lastname' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
					"			validator-group='{{formName}}' name='job_applicant_lastname' id='job_applicant_lastname' class='form-control' placeholder='{{placeholder}}'/>" +
					"		<p class='help-block'>{{description}}</p>" +
					"	</div>" +
					"</div>",
				popoverTemplate: requiredTemplate
			});
			$builderProvider.registerComponent('jobApplicantEmail', {
				group: 'Job Application',
				label: 'Email',
				description: '',
				inputName: 'job_applicant_email',
				placeholder: 'Email',
				required: false,
				unique: true,
				validation: '[email]',
				template: "<div class='form-group'>"+
					"	<label for='job_applicant_email' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
					"			validator-group='{{formName}}' name='job_applicant_email' id='job_applicant_email' class='form-control' placeholder='{{placeholder}}' />" +
					"		<p class='help-block'>{{description}}</p>" +
					"	</div>" +
					"</div>",
				popoverTemplate: optionalTemplate
			});
			$builderProvider.registerComponent('jobApplicantPhone', {
				group: 'Job Application',
				label: 'Phone',
				description: '',
				inputName: 'job_applicant_phone',
				placeholder: 'Phone',
				required: false,
				unique: true,
				validation: '[phone]',
				template: "<div class='form-group'>"+
					"	<label for='job_applicant_phone' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
					"			validator-group='{{formName}}' name='job_applicant_phone' id='job_applicant_phone' class='form-control' placeholder='{{placeholder}}'/>" +
					"		<p class='help-block'>{{description}}</p>" +
					"	</div>" +
					"</div>",
				popoverTemplate: optionalTemplate
			});
			$builderProvider.registerComponent('employmentType', {
				group: 'Job Application',
				label: 'Employment Type',
				description: '',
				inputName: 'employment_type',
				placeholder: 'Employment Type',
				required: false,
				unique: true,
				options: ['Full Time', 'Part Time'],
				template: "<div class='form-group'> " +
					"	<label for='employment_type' class='col-md-4 control-label' ng-class='{\"fb-required\": required}'>{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<div class='radio' ng-repeat='item in options track by $index' validator-required='{{required}}' validator-group='{{formName}}' ng-model='inputText' ng-init='$parent.inputText = \"\"'>" +
					"			<label><input name='employment_type' ng-model='$parent.inputText' validator-group='{{formName}}' value='{{item}}' type='radio'/>" +
					"				{{item}}" +
					"			</label>" +
					"		</div>" +
					"		<p class='help-block'>{{description}}</p>" + 
					"	</div>" +
					"</div>",
				popoverTemplate: "<form>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Label</label>" +
					"		<input type='text' ng-model='label' validator='[required]' class='form-control'/>" +
					"	</div>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Description</label>" +
					"		<input type='text' ng-model='description' class='form-control'/>" +
					"	</div>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Options</label>" +
					"		<textarea class='form-control' rows='3' ng-model='optionsText'/>" +
					"	</div>" +
					"	<div class='checkbox'>" +
					"		<label>" +
					"			<input type='checkbox' ng-model='required' />" +
					"			Required" +
					"		</label>" +
					"	</div>" +
					"	<hr/>" +
					"	<div class='form-group'>" +
					"		<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>" +
					"		<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>" +
					"		<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>" +
					"	</div>" +
					"</form>"
			});
			$builderProvider.registerComponent('employmentPosition', {
				group: 'Job Application',
				label: 'Position',
				description: '',
				inputName: 'employment_position',
				placeholder: 'Position',
				required: false,
				unique: true,
				options: ['Front of House', 'Back of House', 'Management'],
				template: "<div class='form-group'> " +
					"	<label for='employment_position' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
					"	<div class='col-md-8'>" +
					"		<select ng-options='value for value in options' id='employment_position' class='form-control'" +
					"			validator-required='{{required}}' validator-group='{{formName}}'" +
					"			ng-model='inputText' ng-init='inputText = \"\"'/>" +
					"		<p class='help-block'>{{description}}</p>" + 
					"	</div>" +
					"</div>",
				popoverTemplate: "<form>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Label</label>" +
					"		<input type='text' ng-model='label' validator='[required]' class='form-control'/>" +
					"	</div>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Description</label>" +
					"		<input type='text' ng-model='description' class='form-control'/>" +
					"	</div>" +
					"	<div class='form-group'>" +
					"		<label class='control-label'>Options</label>" +
					"		<textarea class='form-control' rows='3' ng-model='optionsText'/>" +
					"	</div>" +
					"	<div class='checkbox'>" +
					"		<label>" +
					"			<input type='checkbox' ng-model='required' />" +
					"			Required" +
					"		</label>" +
					"	</div>" +
					"	<hr/>" +
					"	<div class='form-group'>" +
					"		<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>" +
					"		<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>" +
					"		<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>" +
					"	</div>" +
					"</form>"
			});
		}
	]);
}).call(this);
