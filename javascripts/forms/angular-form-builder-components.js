(function() {
  angular.module('builder.components', ['builder', 'validator.rules']).config([
    '$builderProvider', function($builderProvider) {
      $builderProvider.registerComponent('textInput', {
        group: 'Default',
        label: 'Text Input',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        validationOptions: [
          {
            label: 'none',
            rule: '/.*/'
          }, {
            label: 'number',
            rule: '[number]'
          }, {
            label: 'email',
            rule: '[email]'
          }, {
            label: 'phone',
            rule: '[phone]'
          }, {
            label: 'url',
            rule: '[url]'
          }
        ],
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <input type=\"text\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" id=\"{{formName+index}}\" class=\"form-control\" placeholder=\"{{placeholder}}\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Placeholder</label>\n        <input type='text' ng-model=\"placeholder\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required</label>\n    </div>\n    <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\n        <label class='control-label'>Validation</label>\n        <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('textArea', {
        group: 'Default',
        label: 'Text Area',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <textarea type=\"text\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" id=\"{{formName+index}}\" class=\"form-control\" rows='6' placeholder=\"{{placeholder}}\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Placeholder</label>\n        <input type='text' ng-model=\"placeholder\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required</label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('checkbox', {
        group: 'Default',
        label: 'Checkbox',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        options: ['value one', 'value two'],
        arrayToText: true,
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>\n        <div class='checkbox' ng-repeat=\"item in options track by $index\">\n            <label><input type='checkbox' ng-model=\"$parent.inputArray[$index]\" value='item'/>\n                {{item}}\n            </label>\n        </div>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('radio', {
        group: 'Default',
        label: 'Radio',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        options: ['value one', 'value two'],
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <div class='radio' ng-repeat=\"item in options track by $index\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" ng-model='inputText' ng-init='$parent.inputText = \"\"'>\n            <label><input name='{{formName+index}}' ng-model=\"$parent.inputText\" validator-group=\"{{formName}}\" value='{{item}}' type='radio'/>\n                {{item}}\n            </label>\n        </div>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('select', {
        group: 'Default',
        label: 'Select',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        options: ['value one', 'value two'],
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <select ng-options=\"value for value in options\" id=\"{{formName+index}}\" class=\"form-control\"\n  validator-required=\"{{required}}\" validator-group=\"{{formName}}\"            ng-model=\"inputText\" ng-init=\"inputText = ''\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('datePicker', {
        group: 'Default',
        label: 'Date',
        description: 'description',
        validation: '[date-time]',
        validationOptions: [
          {
            label: 'date',
            rule: '[date]'
          }, {
            label: 'date & time',
            rule: '[date-time]'
          }
        ],
        required: false,
        placeholder: 'MM/dd/yyyy, hh:mm meridian',
        template: "<div class='form-group datepicker'>"+
            "       <label for='{{formName+index}}' class='col-md-4 control-label' ng-class='{\"fb-required\":required}'>{{label}}</label>" +
            "       <div class='col-md-8'>" +
            "        <input type='text' ng-model='inputText' validator-required='{{required}}' " +
            "                       model-view-value='true' ui-mask='{{(validation == \"[date]\" ? \"99/99/9999\" : \"99/99/9999, 99:99 AA\")}}' " +
            "                       ui-mask-placeholder ui-mask-placeholder-char='_' " +
            "                       validator-group='{{formName}}' id='{{formName+index}}'" +
            "         class='form-control' placeholder='{{(validation == \"[date]\" ? \"mm/dd/yyyy\" : \"mm/dd/yyyy, 00:00 AM\")}}'/>" +
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
                <div class=\"checkbox\">\
                    <label>\
                        <input type=\'checkbox\' ng-model=\"required\" /> Required\
                    </label>\
                </div>\
                <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\
                    <label class='control-label'>Validation</label>\
                    <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\
                </div>\
                <hr/>\
                <div class='form-group'>\
                    <input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
                    <input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
                    <input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
                </div>\
            </form>"
      });
      $builderProvider.registerComponent('location', {
          group: 'Default',
          label: 'Location',
          description: 'description',
          placeholder: 'placeholder',
          inputName: 'location',
          required: false,
          unique: true,
          options: [],
          template: "<div class=\"form-group\">" +
          "    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class='{\"fb-required\":required}'>{{label}}</label>" +
          "    <div class=\"col-md-8\">" + 
          "        <select ng-options=\"value.id as value.name for value in options\" id=\"{{formName+index}}\" class=\"form-control\"" +
          "  validator-required=\"{{required}}\" validator-group=\"{{formName}}\"           ng-model=\"inputText\" ng-init=\"inputText = options[0].id\"/>" +
          "        <p class='help-block'>{{description}}</p>" +
          "    </div>" +
          "</div>",
          popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n    <p class='help-block'>NOTE: This dropdown menu gets populated automatically with the names of your child organizations.</p>\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('pageBreak', {
        group: 'Default',
        label: 'Page Break',
        description: '',
        placeholder: '',
        template: "<div class='form-group form-page-break'>" +
            "   <div class=\"full-width-component\">" +
            "       <h4>{{label}}</h4>" +
            "           <p class='help-block'>{{description}}</p>" +
            "       <hr />" +
            "   </div>" +
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
              });
      return $builderProvider.registerComponent('textBlock', {
        group: 'Default',
        label: 'Text Block',
        description: 'placeholder',
        placeholder: '',
        template: "<div class='form-group'>"+
                "   <div class=\"full-width-component text-block\">" +
                "       <h4 class='text-block-label'>{{label}}</h4>" +
                "       <p class='help-block col-md-12 text-block-text' ng-bind-html='description'></p>" +
                "   </div>" +
                "</div>",
        popoverTemplate: "<form>\
                    <div class='form-group'>\
                        <label class='control-label'>Label</label>\
                        <input type='text' ng-model='label' class='form-control'/>\
                    </div>\
                    <div class='form-group'>\
                        <label class='control-label'>Body</label>\
                        <textArea type='text' ng-model='description' class='form-control'/>\
                    </div>\
                    <hr/>\
                    <div class='form-group'>\
                        <input type='submit' ng-click='popover.save($event)' class='btn btn-primary' value='Save'/>\
                        <input type='button' ng-click='popover.cancel($event)' class='btn btn-default' value='Cancel'/>\
                        <input type='button' ng-click='popover.remove($event)' class='btn btn-danger' value='Delete'/>\
                    </div>\
                </form>"
	          });
    }
  ]);

}).call(this);
