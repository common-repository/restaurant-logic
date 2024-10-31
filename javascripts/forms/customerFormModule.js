(function() {
angular.module('builder.customerComponents', ['builder', 'validator.rules']).config([
	'$builderProvider', function($builderProvider) {
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
		
		$builderProvider.registerComponent('customerFirstname', {
			group: 'Customer',
			label: 'First Name',
			description: '',
			inputName: 'customer_firstname',
			placeholder: 'First Name',
			required: true,
			unique: true,
			template: "<div class='form-group'>"+
				"	<label for='customer_firstname' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_firstname' id='customer_firstname' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerLastname', {
			group: 'Customer',
			label: 'Last Name',
			description: '',
			inputName: 'customer_lastname',
			placeholder: 'Last Name',
			unique: true,
			required: false,
			template: "<div class='form-group'>"+
				"	<label for='customer_lastname' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_lastname' id='customer_lastname' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerEmail', {
			group: 'Customer',
			label: 'Email',
			description: '',
			inputName: 'customer_email',
			placeholder: 'Email',
			required: false,
			unique: true,
			validation: '[customer-email]',
			template: "<div class='form-group'>"+
				"	<label for='customer_email' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='emailAddress' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_email' id='customer_email' class='form-control' placeholder='{{placeholder}}'" +
				"			ng-change='inputText=(emailAddress.length > 0 ? emailAddress + \"||\" + subscribeEmail : \"\")' />" +
				"		<p class='help-block'>{{description}}</p>" +
				"		<input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/> " +
				"	</div>" +
				"	<div class='col-md-offset-4 col-md-8 sign-up-prompt' ng-show='emailAddress.length>0'>" +
				"		<label>" +
				"			<input value='Yes' type='checkbox' ng-model='subscribeEmail' ng-true-value=\"'Yes'\" ng-false-value=\"'No'\" ng-change='inputText=emailAddress + \"||\" + subscribeEmail' ng-init='subscribeEmail=\"Yes\"'/>" +
				"			By checking this, you agree to join our email list." +
				"		</label>\n" +
				"	</div>\n" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerGroups', {
			group: 'Customer',
			label: 'Signup Groups',
			description: '',
			inputName: 'customer_groups',
			placeholder: 'Signup Groups',
			required: false,
			unique: true,		
			arrayToText: true,
			template: "<div class='form-group'>" +
				"	<label for='{{formName+index}}' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label> " +
				"	<div class='col-md-8'>" + 
				"		<input type='hidden' ng-model='inputText' validator-required='{{required}}' validator-group='{{formName}}'/>" + 
				"		<div class='checkbox' ng-repeat='item in options track by $index'>" + 
				"			<label><input type='checkbox' ng-model='$parent.inputArray[$index]'/>" + 
				"				{{item.name}}" + 
				"			</label>" +
				"		</div>" + 
				"		<div ng-if='options.length == 0'> " +
				"			<p>This location has no signup groups.</p>" +
				"		</div> " +
				"		<p class='help-block'>{{description}}</p>" + 
				"	</div>" + 
				"</div>",
			popoverTemplate: "<form> " +
				"		<div class='form-group'> " +
				"		<label class='control-label'>Label</label> " +
				"		<input type='text' ng-model='label' validator='[required]' class='form-control'/> " +
				"	</div> " +
				"	<div class='form-group'> " +
				"		<label class='control-label'>Description</label> " +
				"		<input type='text' ng-model='description' class='form-control'/> " +
				"	</div> " +
				"	<div class='checkbox'> " +
				"		<label><input type='checkbox' ng-model='required' />Required</label> " +
				"	</div> " +
				"	<p class='help-block'> " +
				"		Note: The options for this field are automatically populated with your organization's signup groups. To view, add, or edit your signup groups, <a href='/customer/groups' target='none'>click here</a>. " +
				"	</p> " +
				"	<hr/> " +
				"	<div class='form-group'> " +
				"		<input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/> " +
				"		<input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/> " +
				"		<input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/> " +
				"	</div> " +
				"</form>"
		});
		$builderProvider.registerComponent('customerPhone', {
			group: 'Customer',
			label: 'Phone',
			description: '',
			inputName: 'customer_phone',
			placeholder: 'Phone',
			unique: true,
			validation: '[phone]',
			template: "<div class='form-group'>"+
				"	<label for='customer_phone' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_phone' id='customer_phone' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerAddress', {
			group: 'Customer',
			label: 'Street Address',
			description: '',
			inputName: 'customer_address',
			placeholder: 'Address',
			unique: true,
			template: "<div class='form-group'>"+
				"	<label for='customer_address' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_address' id='customer_address' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerCity', {
			group: 'Customer',
			label: 'City',
			description: '',
			inputName: 'customer_city',
			placeholder: 'City',
			unique: true,
			template: "<div class='form-group'>"+
				"	<label for='customer_city' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_city' id='customer_address' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate:optionalTemplate
		});
		$builderProvider.registerComponent('customerState', {
			group: 'Customer',
			label: 'State',
			description: '',
			inputName: 'customer_state',
			placeholder: 'State',
			unique: true,
			template: "<div class='form-group'>" +
				"	<label for='customer_state' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<select ng-options='option.value as option.name for option in options' id='customer_state' class='form-control'" +
				"			validator-required='{{required}}' validator-group='{{formName}}'" +
				"			ng-model='inputText' ng-init='inputText=\"\"' name='customer_state' />" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate:optionalTemplate
		});
		$builderProvider.registerComponent('customerZip', {
			group: 'Customer',
			label: 'ZIP Code',
			description: '',
			inputName: 'customer_zip',
			placeholder: 'Zip',
			unique: true,
			template: "<div class='form-group'>"+
				"	<label for='customer_zip' class='col-md-4 control-label' ng-class=\"{'fb-required':required}\">{{label}}</label>" +
				"	<div class='col-md-8'>" +
				"		<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"			validator-group='{{formName}}' name='customer_zip' id='customer_zip' class='form-control' placeholder='{{placeholder}}'/>" +
				"		<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerBirthday', {
			group: 'Customer',
			label: 'Birthday',
			description: '',
			inputName: 'customer_birthday',
			validation: '[date]',
			placeholder: 'mm/dd/yyyy',
			required: false,
			unique: true,
			template: "<div class='form-group datepicker'>"+
				"		<label for='customer_birthday' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
				"		<div class='col-md-8'>" +
				"			<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"					validator-group='{{formName}}' name='customer_birthday' model-view-value='true' ui-mask='99/99/9999' ui-mask-placeholder ui-mask-placeholder-char='_' id='customer_birthday'" +
				"					class='form-control' placeholder='{{placeholder}}'/>" +
				"			<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerAnniversary', {
			group: 'Customer',
			label: 'Anniversary',
			description: '',
			inputName: 'customer_anniversary',
			validation: '[date]',
			placeholder: 'mm/dd/yyyy',
			required: false,
			unique: true,
			template: "<div class='form-group datepicker'>"+
				"		<label for='customer_anniversary' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
				"		<div class='col-md-8'>" +
				"			<input type='text' ng-model='inputText' validator-required='{{required}}' " +
				"					validator-group='{{formName}}' name='customer_anniversary' model-view-value='true' ui-mask='99/99/9999' ui-mask-placeholder ui-mask-placeholder-char='_' id='customer_anniversary'" +
				"					class='form-control' placeholder='{{placeholder}}'/>" +
				"			<p class='help-block'>{{description}}</p>" +
				"	</div>" +
				"</div>",
			popoverTemplate: optionalTemplate
		});
		$builderProvider.registerComponent('customerQualifier', {
			group: 'Customer',
			label: 'What question to qualify your customers?',
			description: '',
			inputName: 'customer_qualifier',
			unique: true,
			options: ['Option 1'],
			template: "<div class='form-group'>"+
				"	<label for='{{formName+index}}' class='col-md-4 control-label'>{{label}}</label>"+
				"	<div class='col-md-8'>"+
				"		<select ng-options='value for value in options' name='customer_qualifier' id='{{formName+index}}' class='form-control'"+
				"			ng-model='inputText' ng-init='inputText = options[0]'/>"+
				"		<p class='help-block'>{{description}}</p>"+
				"	</div>"+
				"</div>",
			popoverTemplate: requiredSelectTemplate
		});
	}
]);
}).call(this);
