(function() {
  var copyObjectToScope;

  copyObjectToScope = function(object, scope) {

    /*
    Copy object (ng-repeat="object in objects") to scope without `hashKey`.
     */
    var key, value;
    for (key in object) {
      value = object[key];
      if (key !== '$$hashKey') {
        scope[key] = value;
      }
    }
  };

  angular.module('builder.controller', ['builder.provider']).controller('fbFormObjectEditableController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.setupScope = function(formObject) {

        /*
        1. Copy origin formObject (ng-repeat="object in formObjects") to scope.
        2. Setup optionsText with formObject.options.
        3. Watch scope.label, .description, .placeholder, .required, .options then copy to origin formObject.
        4. Watch scope.optionsText then convert to scope.options.
        5. setup validationOptions
         */
        var component;
        copyObjectToScope(formObject, $scope);
        $scope.optionsText = formObject.options.join('\n');
        $scope.$watch('[label, description, placeholder, required, options, validation]', function() {
          formObject.label = $scope.label;
          formObject.description = $scope.description;
          formObject.placeholder = $scope.placeholder;
          formObject.required = $scope.required;
          formObject.options = $scope.options;
          return formObject.validation = $scope.validation;
        }, true);
        $scope.$watch('optionsText', function(text) {
          var x;
          $scope.options = (function() {
            var _i, _len, _ref, _results;
            _ref = text.split('\n');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              if (x.length > 0) {
                _results.push(x);
              }
            }
            return _results;
          })();
          return $scope.inputText = $scope.options[0];
        });
        component = $builder.components[formObject.component];
        return $scope.validationOptions = component.validationOptions;
      };
      return $scope.data = {
        model: null,
        backup: function() {

          /*
          Backup input value.
           */
          return this.model = {
            label: $scope.label,
            description: $scope.description,
            placeholder: $scope.placeholder,
            required: $scope.required,
            optionsText: $scope.optionsText,
            validation: $scope.validation
          };
        },
        rollback: function() {

          /*
          Rollback input value.
           */
          if (!this.model) {
            return;
          }
          $scope.label = this.model.label;
          $scope.description = this.model.description;
          $scope.placeholder = this.model.placeholder;
          $scope.required = this.model.required;
          $scope.optionsText = this.model.optionsText;
          return $scope.validation = this.model.validation;
        }
      };
    }
  ]).controller('fbComponentsController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.selectGroup = function($event, group) {
        var component, name, _ref, _results;
        if ($event != null) {
          $event.preventDefault();
        }
        $scope.activeGroup = group;
        $scope.components = [];
        _ref = $builder.components;
        _results = [];
        for (name in _ref) {
          component = _ref[name];
          if (component.group === group) {
            _results.push($scope.components.push(component));
          }
        }
        return _results;
      };
      $scope.groups = $builder.groups;
      $scope.activeGroup = $scope.groups[0];
      $scope.allComponents = $builder.components;
      $scope.noMoreComponents = function(){
        return $scope.components.every(function(component){
          if(component.unique && component.placedItems > 0){
            return true;
          }
          return false;
        });
      }
      return $scope.$watch('allComponents', function() {
        return $scope.selectGroup(null, $scope.activeGroup);
      });
    }
  ]).controller('fbComponentController', [
    '$scope', function($scope) {
      return $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
    }
  ]).controller('fbFormController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder, $timeout;
      $builder = $injector.get('$builder');
      $timeout = $injector.get('$timeout');
      if ($scope.input == null) {
        $scope.input = [];
      }
      
      $scope.pagination = $scope.$parent.pagination;
      
      return $scope.$watch('form', function() {
        if ($scope.input.length > $scope.form.length) {
          $scope.input.splice($scope.form.length);
        }
        return $timeout(function() {
          return $scope.$broadcast($builder.broadcastChannel.updateInput);
        });
      }, true);
    }
  ]).controller('fbFormObjectController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
      return $scope.updateInput = function(value) {

        /*
        Copy current scope.input[X] to $parent.input.
        @param value: The input value.
         */
        var input;
        input = {
          id: $scope.formObject.id,
          label: $scope.formObject.label,
		  name: $scope.formObject.inputName || $scope.formObject.component + $scope.formObject.id,
          value: value != null ? value : ''
        };
        
        return $scope.$parent.input.splice($scope.$index, 1, input);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('builder.directive', ['builder.provider', 'builder.controller', 'builder.drag', 'validator']).directive('fbBuilder', [
    '$injector', function($injector) {
      var $builder, $drag;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      return {
        restrict: 'A',
        template: "<div class='form-horizontal'>\n    <div class='fb-form-object-editable' ng-repeat=\"object in formObjects\"\n        fb-form-object-editable=\"object\"></div>\n</div>",
        link: function(scope, element, attrs) {
          var beginMove, _base, _name;
          scope.formName = attrs.fbBuilder;
          if ((_base = $builder.forms)[_name = scope.formName] == null) {
            _base[_name] = [];
          }
          scope.formObjects = $builder.forms[scope.formName];
          beginMove = true;
          jQuery(element).addClass('fb-builder');
          return $drag.droppable(jQuery(element), {
            move: function(e) {
              var $empty, $formObject, $formObjects, height, index, offset, positions, _i, _j, _ref, _ref1;
              if (beginMove) {
                jQuery("div.fb-form-object-editable").popover('hide');
                beginMove = false;
              }
              $formObjects = jQuery(element).find('.fb-form-object-editable:not(.empty,.dragging)');
              if ($formObjects.length === 0) {
                if (jQuery(element).find('.fb-form-object-editable.empty').length === 0) {
                  jQuery(element).find('>div:first').append(jQuery("<div class='fb-form-object-editable empty'></div>"));
                }
                return;
              }
              positions = [];
              positions.push(-1000);
              for (index = _i = 0, _ref = $formObjects.length; _i < _ref; index = _i += 1) {
                $formObject = jQuery($formObjects[index]);
                offset = $formObject.offset();
                height = $formObject.height();
                positions.push(offset.top + height / 2);
              }
              positions.push(positions[positions.length - 1] + 1000);
              for (index = _j = 1, _ref1 = positions.length; _j < _ref1; index = _j += 1) {
                if (e.pageY > positions[index - 1] && e.pageY <= positions[index]) {
                  jQuery(element).find('.empty').remove();
                  $empty = jQuery("<div class='fb-form-object-editable empty'></div>");
                  if (index - 1 < $formObjects.length) {
                    $empty.insertBefore(jQuery($formObjects[index - 1]));
                  } else {
                    $empty.insertAfter(jQuery($formObjects[index - 2]));
                  }
                  break;
                }
              }
            },
            out: function() {
              if (beginMove) {
                jQuery("div.fb-form-object-editable").popover('hide');
                beginMove = false;
              }
              return jQuery(element).find('.empty').remove();
            },
            up: function(e, isHover, draggable) {
              var formObject, newIndex, oldIndex;
              beginMove = true;
              if (!$drag.isMouseMoved()) {
                jQuery(element).find('.empty').remove();
                return;
              }
              if (!isHover && draggable.mode === 'drag') {
                formObject = draggable.object.formObject;
                if(formObject.required){
                  flashMessenger.showMessage("Can't remove required field.", 'danger');
                  return;
                } else if (formObject.editable) {
                  $builder.removeFormObject(attrs.fbBuilder, formObject.index);
                }  
              } else if (isHover) {
                if (draggable.mode === 'mirror') {
                  $builder.insertFormObject(scope.formName, jQuery(element).find('.empty').index('.fb-form-object-editable'), {
                    component: draggable.object.componentName
                  });
                }
                if (draggable.mode === 'drag') {
                  oldIndex = draggable.object.formObject.index;
                  newIndex = jQuery(element).find('.empty').index('.fb-form-object-editable');
                  if (oldIndex < newIndex) {
                    newIndex--;
                  }
                  $builder.updateFormObjectIndex(scope.formName, oldIndex, newIndex);
                }
              }
              return jQuery(element).find('.empty').remove();
            }
          });
        }
      };
    }
  ]).directive('fbFormObjectEditable', [
    '$injector', function($injector) {
      var $builder, $compile, $drag, $validator;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      $compile = $injector.get('$compile');
      $validator = $injector.get('$validator');
      return {
        restrict: 'A',
        controller: 'fbFormObjectEditableController',
        scope: {
          formObject: '=fbFormObjectEditable'
        },
        link: function(scope, element) {
          var popover;
          scope.inputArray = [];
          scope.$component = $builder.components[scope.formObject.component];
          scope.setupScope(scope.formObject);
          scope.$watch('$component.template', function(template) {
            var view;
            if (!template) {
              return;
            }
            view = $compile(template)(scope);
            return jQuery(element).html(view);
          });
          jQuery(element).on('click', function() {
            return false;
          });
          $drag.draggable(jQuery(element), {
            object: {
              formObject: scope.formObject
            }
          });
          if (!scope.formObject.editable) {
            return;
          }
          popover = {};
          scope.$watch('$component.popoverTemplate', function(template) {
            if (!template) {
              return;
            }
            jQuery(element).removeClass(popover.id);
            popover = {
              id: "fb-" + (Math.random().toString().substr(2)),
              isClickedSave: false,
              view: null,
              html: template
            };
            popover.html = jQuery(popover.html).addClass(popover.id);
            popover.view = $compile(popover.html)(scope);
            jQuery(element).addClass(popover.id);
            return jQuery(element).popover({
              html: true,
              title: scope.$component.label,
              content: popover.view,
              container: 'body'
            });
          });
          scope.popover = {
            save: function($event) {

              /*
              The save event of the popover.
               */
              $event.preventDefault();
              $validator.validate(scope).success(function() {
                popover.isClickedSave = true;
                return jQuery(element).popover('hide');
              });
            },
            remove: function($event) {

              /*
              The delete event of the popover.
               */
              $event.preventDefault();
              $builder.removeFormObject(scope.$parent.formName, scope.formObject.index);
              jQuery(element).popover('hide');
            },
            shown: function() {

              /*
              The shown event of the popover.
               */
              scope.data.backup();
              return popover.isClickedSave = false;
            },
            cancel: function($event) {

              /*
              The cancel event of the popover.
               */
              scope.data.rollback();
              if ($event) {
                $event.preventDefault();
                jQuery(element).popover('hide');
              }
            }
          };
          jQuery(element).on('show.bs.popover', function() {
            var $popover, elementOrigin, popoverTop;
            if ($drag.isMouseMoved()) {
              return false;
            }
            jQuery("div.fb-form-object-editable:not(." + popover.id + ")").popover('hide');
            $popover = jQuery("form." + popover.id).closest('.popover');
            if ($popover.length > 0) {
              elementOrigin = jQuery(element).offset().top + jQuery(element).height() / 2;
              popoverTop = elementOrigin - $popover.height() / 2;
              $popover.css({
                position: 'absolute',
                top: popoverTop
              });
              $popover.show();
              setTimeout(function() {
                $popover.addClass('in');
                return jQuery(element).triggerHandler('shown.bs.popover');
              }, 0);
              return false;
            }
          });
          jQuery(element).on('shown.bs.popover', function() {
            jQuery(".popover ." + popover.id + " input:first").select();
            scope.$apply(function() {
              return scope.popover.shown();
            });
          });
          return jQuery(element).on('hide.bs.popover', function() {
            var $popover;
            $popover = jQuery("form." + popover.id).closest('.popover');
            if (!popover.isClickedSave) {
              if (scope.$$phase || scope.$root.$$phase) {
                scope.popover.cancel();
              } else {
                scope.$apply(function() {
                  return scope.popover.cancel();
                });
              }
            }
            $popover.removeClass('in');
            setTimeout(function() {
              return $popover.hide();
            }, 300);
            return false;
          });
        }
      };
    }
  ]).directive('fbComponents', function() {
    return {
      restrict: 'A',
      template: "<ul ng-if=\"groups.length > 1\" class=\"nav nav-tabs nav-justified\">\n    <li ng-repeat=\"group in groups\" ng-class=\"{active:activeGroup==group}\">\n        <a href='#' ng-click=\"selectGroup($event, group)\">{{group}}</a>\n    </li>\n</ul>\n<div class='form-horizontal'>\n    <div class='fb-component' ng-repeat=\"component in components\"\n        fb-component=\"component\"  ng-hide=\"component.unique && component.placedItems > 0\"></div><div ng-if=\"noMoreComponents()\" style=\"padding:10px; text-align:center;\">You have used all of these components.</div> \n</div>",
      controller: 'fbComponentsController'
    };
  }).directive('fbComponent', [
    '$injector', function($injector) {
      var $builder, $compile, $drag;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      $compile = $injector.get('$compile');
      return {
        restrict: 'A',
        scope: {
          component: '=fbComponent'
        },
        controller: 'fbComponentController',
        link: function(scope, element) {
          scope.copyObjectToScope(scope.component);
          $drag.draggable(jQuery(element), {
            mode: 'mirror',
            defer: false,
            object: {
              componentName: scope.component.name
            }
          });
          return scope.$watch('component.template', function(template) {
            var view;
            if (!template) {
              return;
            }
            view = $compile(template)(scope);
            return jQuery(element).html(view);
          });
        }
      };
    }
  ]).directive('fbForm', [
    '$injector', function($injector) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          formName: '@fbForm',
          input: '=ngModel',
          "default": '=fbDefault'
        },
        template: "<div class='fb-form-object' ng-show='object.index >= pagination.startIndex && object.index < pagination.endIndex' ng-repeat=\"object in form\" fb-form-object=\"object\"></div>",
        controller: 'fbFormController',
        link: function(scope, element, attrs) {
          var $builder, _base, _name;
          $builder = $injector.get('$builder');
          if ((_base = $builder.forms)[_name = scope.formName] == null) {
            _base[_name] = [];
          }
          return scope.form = $builder.forms[scope.formName];
        }
      };
    }
  ]).directive('fbFormObject', [
    '$injector', function($injector) {
      var $builder, $compile, $parse;
      $builder = $injector.get('$builder');
      $compile = $injector.get('$compile');
      $parse = $injector.get('$parse');
      return {
        restrict: 'A',
        controller: 'fbFormObjectController',
        link: function(scope, element, attrs) { 
        
          scope.formObject = $parse(attrs.fbFormObject)(scope);
          scope.$component = $builder.components[scope.formObject.component];
          scope.$on($builder.broadcastChannel.updateInput, function() {
            return scope.updateInput(scope.inputText);
          });
          //Add custom handling for the manager contact field.
          if (scope.$component.name == "managerContact") {
            scope.$watch('showManagerFields', function(newValue, oldValue) {
                if(newValue == "Yes"){
                  scope.$emit('managerContactYes', {});
                } else {
                  scope.contactEmail = "";
                  scope.contactPhone = "";
                }
              });
            scope.$on('contactFieldsFilled', function (event, data) {
                scope.contactEmail = (data.email ? data.email.substring(0, data.email.indexOf('||')) : "");
                scope.contactPhone = data.phone;
              }); 
          }
          if (scope.$component.arrayToText) {
            scope.inputArray = [];
            //This $on catches the broadcast from the formOutputController for
            // when the location field has changed values and the customer groups
            // have been changed. It wipes the inputArray, clearing any checkboxes
            // the user had checked before the customer groups changed.
            scope.$on('customerGroupsChanged', function (event, data) {
              if(scope.$component.name == 'customerGroups'){
                scope.inputArray.length = 0;
              }
            }); 
            scope.$watch('inputArray', function(newValue, oldValue) {
              var checked, index;
              if (newValue === oldValue) {
                return;
              }
              checked = [];
              for (index in scope.inputArray) {
                if (scope.inputArray[index]) {
                  if(typeof scope.options[index] == 'object'){
                    checked.push(scope.options[index].value);
                  } else {
                    checked.push(scope.options[index]);
                  }
                }
              }
              return scope.inputText = checked.join(', ');
            }, true);
          }
          scope.$watch('inputText', function() {
            return scope.updateInput(scope.inputText);
          });
          scope.$watch(attrs.fbFormObject, function() {
            return scope.copyObjectToScope(scope.formObject);
          }, true);
          scope.$watch('$component.template', function(template) {
            var $input, $template, view;
            if (!template) {
              return;
            }
            $template = jQuery(template);
            $input = $template.find("[ng-model='inputText']");
            $input.attr({
              validator: '{{validation}}'
            });
            view = $compile($template)(scope);
            return jQuery(element).html(view);
          });
          if (!scope.$component.arrayToText && scope.formObject.options.length > 0) {
            scope.inputText = scope.formObject.options[0];
          }
          return scope.$watch("default[" + scope.formObject.id + "]", function(value) {
            if (!value) {
              return;
            }
            if (scope.$component.arrayToText) {
              return scope.inputArray = value;
            } else {
              return scope.inputText = value;
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('builder.drag', []).provider('$drag', function() {
    var $injector, $rootScope, delay;
    $injector = null;
    $rootScope = null;
    this.data = {
      draggables: {},
      droppables: {}
    };
    this.mouseMoved = false;
    this.isMouseMoved = (function(_this) {
      return function() {
        return _this.mouseMoved;
      };
    })(this);
    this.hooks = {
      down: {},
      move: {},
      up: {}
    };
    this.eventMouseMove = function() {};
    this.eventMouseUp = function() {};
    jQuery((function(_this) {
      return function() {
        jQuery(document).on('mousedown', function(e) {
          var func, key, _ref;
          _this.mouseMoved = false;
          _ref = _this.hooks.down;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
        jQuery(document).on('mousemove', function(e) {
          var func, key, _ref;
          _this.mouseMoved = true;
          _ref = _this.hooks.move;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
        return jQuery(document).on('mouseup', function(e) {
          var func, key, _ref;
          _ref = _this.hooks.up;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
      };
    })(this));
    this.currentId = 0;
    this.getNewId = (function(_this) {
      return function() {
        return "" + (_this.currentId++);
      };
    })(this);
    this.setupEasing = function() {
      return jQuery.extend(jQuery.easing, {
        easeOutQuad: function(x, t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
        }
      });
    };
    this.setupProviders = function(injector) {

      /*
      Setup providers.
       */
      $injector = injector;
      return $rootScope = $injector.get('$rootScope');
    };
    this.isHover = (function(_this) {
      return function($elementA, $elementB) {

        /*
        Is element A hover on element B?
        @param $elementA: jQuery object
        @param $elementB: jQuery object
         */
        var isHover, offsetA, offsetB, sizeA, sizeB;
        offsetA = $elementA.offset();
        offsetB = $elementB.offset();
        sizeA = {
          width: $elementA.width(),
          height: $elementA.height()
        };
        sizeB = {
          width: $elementB.width(),
          height: $elementB.height()
        };
        isHover = {
          x: false,
          y: false
        };
        isHover.x = offsetA.left > offsetB.left && offsetA.left < offsetB.left + sizeB.width;
        isHover.x = isHover.x || offsetA.left + sizeA.width > offsetB.left && offsetA.left + sizeA.width < offsetB.left + sizeB.width;
        if (!isHover) {
          return false;
        }
        isHover.y = offsetA.top > offsetB.top && offsetA.top < offsetB.top + sizeB.height;
        isHover.y = isHover.y || offsetA.top + sizeA.height > offsetB.top && offsetA.top + sizeA.height < offsetB.top + sizeB.height;
        return isHover.x && isHover.y;
      };
    })(this);
    delay = function(ms, func) {
      return setTimeout(function() {
        return func();
      }, ms);
    };
    this.autoScroll = {
      up: false,
      down: false,
      scrolling: false,
      scroll: (function(_this) {
        return function() {
          _this.autoScroll.scrolling = true;
          if (_this.autoScroll.up) {
            jQuery('html, body').dequeue().animate({
              scrollTop: jQuery(window).scrollTop() - 50
            }, 100, 'easeOutQuad');
            return delay(100, function() {
              return _this.autoScroll.scroll();
            });
          } else if (_this.autoScroll.down) {
            jQuery('html, body').dequeue().animate({
              scrollTop: jQuery(window).scrollTop() + 50
            }, 100, 'easeOutQuad');
            return delay(100, function() {
              return _this.autoScroll.scroll();
            });
          } else {
            return _this.autoScroll.scrolling = false;
          }
        };
      })(this),
      start: (function(_this) {
        return function(e) {
          if (e.clientY < 50) {
            _this.autoScroll.up = true;
            _this.autoScroll.down = false;
            if (!_this.autoScroll.scrolling) {
              return _this.autoScroll.scroll();
            }
          } else if (e.clientY > jQuery(window).innerHeight() - 50) {
            _this.autoScroll.up = false;
            _this.autoScroll.down = true;
            if (!_this.autoScroll.scrolling) {
              return _this.autoScroll.scroll();
            }
          } else {
            _this.autoScroll.up = false;
            return _this.autoScroll.down = false;
          }
        };
      })(this),
      stop: (function(_this) {
        return function() {
          _this.autoScroll.up = false;
          return _this.autoScroll.down = false;
        };
      })(this)
    };
    this.dragMirrorMode = (function(_this) {
      return function($element, defer, object) {
        var result;
        if (defer == null) {
          defer = true;
        }
        result = {
          id: _this.getNewId(),
          mode: 'mirror',
          maternal: $element[0],
          element: null,
          object: object
        };
        $element.on('mousedown', function(e) {
          var $clone;
          e.preventDefault();
          $clone = $element.clone();
          result.element = $clone[0];
          $clone.addClass("fb-draggable form-horizontal prepare-dragging");
          _this.hooks.move.drag = function(e, defer) {
            var droppable, id, _ref, _results;
            if ($clone.hasClass('prepare-dragging')) {
              $clone.css({
                width: $element.width(),
                height: $element.height()
              });
              $clone.removeClass('prepare-dragging');
              $clone.addClass('dragging');
              if (defer) {
                return;
              }
            }
            $clone.offset({
              left: e.pageX - $clone.width() / 2,
              top: e.pageY - $clone.height() / 2
            });
            _this.autoScroll.start(e);
            _ref = _this.data.droppables;
            _results = [];
            for (id in _ref) {
              droppable = _ref[id];
              if (_this.isHover($clone, jQuery(droppable.element))) {
                _results.push(droppable.move(e, result));
              } else {
                _results.push(droppable.out(e, result));
              }
            }
            return _results;
          };
          _this.hooks.up.drag = function(e) {
            var droppable, id, isHover, _ref;
            _ref = _this.data.droppables;
            for (id in _ref) {
              droppable = _ref[id];
              isHover = _this.isHover($clone, jQuery(droppable.element));
              droppable.up(e, isHover, result);
            }
            delete _this.hooks.move.drag;
            delete _this.hooks.up.drag;
            result.element = null;
            $clone.remove();
            return _this.autoScroll.stop();
          };
          jQuery('body').append($clone);
          if (!defer) {
            return _this.hooks.move.drag(e, defer);
          }
        });
        return result;
      };
    })(this);
    this.dragDragMode = (function(_this) {
      return function($element, defer, object) {
        var result;
        if (defer == null) {
          defer = true;
        }
        result = {
          id: _this.getNewId(),
          mode: 'drag',
          maternal: null,
          element: $element[0],
          object: object
        };
        $element.addClass('fb-draggable');
        $element.on('mousedown', function(e) {
          e.preventDefault();
          if ($element.hasClass('dragging')) {
            return;
          }
          $element.addClass('prepare-dragging');
          _this.hooks.move.drag = function(e, defer) {
            var droppable, id, _ref;
            if ($element.hasClass('prepare-dragging')) {
              $element.css({
                width: $element.width(),
                height: $element.height()
              });
              $element.removeClass('prepare-dragging');
              $element.addClass('dragging');
              if (defer) {
                return;
              }
            }
            $element.offset({
              left: e.pageX - $element.width() / 2,
              top: e.pageY - $element.height() / 2
            });
            _this.autoScroll.start(e);
            _ref = _this.data.droppables;
            for (id in _ref) {
              droppable = _ref[id];
              if (_this.isHover($element, jQuery(droppable.element))) {
                droppable.move(e, result);
              } else {
                droppable.out(e, result);
              }
            }
          };
          _this.hooks.up.drag = function(e) {
	        var droppable, id, isHover, _ref;
	        _ref = _this.data.droppables;
	        for (id in _ref) {
	          droppable = _ref[id];
	          isHover = _this.isHover($element, jQuery(droppable.element));
	          droppable.up(e, isHover, result);
	        }
            delete _this.hooks.move.drag;
            delete _this.hooks.up.drag;
            $element.css({
              width: '',
              height: '',
              left: '',
              top: ''
            });
            $element.removeClass('dragging defer-dragging');
            return _this.autoScroll.stop();
          };
          if (!defer) {
            return _this.hooks.move.drag(e, defer);
          }
        });
        return result;
      };
    })(this);
    this.dropMode = (function(_this) {
      return function($element, options) {
        var result;
        result = {
          id: _this.getNewId(),
          element: $element[0],
          move: function(e, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.move === "function" ? options.move(e, draggable) : void 0;
            });
          },
          up: function(e, isHover, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.up === "function" ? options.up(e, isHover, draggable) : void 0;
            });
          },
          out: function(e, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.out === "function" ? options.out(e, draggable) : void 0;
            });
          }
        };
        return result;
      };
    })(this);
    this.draggable = (function(_this) {
      return function($element, options) {
        var draggable, element, result, _i, _j, _len, _len1;
        if (options == null) {
          options = {};
        }

        /*
        Make the element could be drag.
        @param element: The jQuery element.
        @param options: Options
            mode: 'drag' [default], 'mirror'
            defer: yes/no. defer dragging
            object: custom information
         */
        result = [];
        if (options.mode === 'mirror') {
          for (_i = 0, _len = $element.length; _i < _len; _i++) {
            element = $element[_i];
            draggable = _this.dragMirrorMode(jQuery(element), options.defer, options.object);
            result.push(draggable.id);
            _this.data.draggables[draggable.id] = draggable;
          }
        } else {
          for (_j = 0, _len1 = $element.length; _j < _len1; _j++) {
            element = $element[_j];
            draggable = _this.dragDragMode(jQuery(element), options.defer, options.object);
            result.push(draggable.id);
            _this.data.draggables[draggable.id] = draggable;
          }
        }
        return result;
      };
    })(this);
    this.droppable = (function(_this) {
      return function($element, options) {
        var droppable, element, result, _i, _len;
        if (options == null) {
          options = {};
        }

        /*
        Make the element coulde be drop.
        @param $element: The jQuery element.
        @param options: The droppable options.
            move: The custom mouse move callback. (e, draggable)->
            up: The custom mouse up callback. (e, isHover, draggable)->
            out: The custom mouse out callback. (e, draggable)->
         */
        result = [];
        for (_i = 0, _len = $element.length; _i < _len; _i++) {
          element = $element[_i];
          droppable = _this.dropMode(jQuery(element), options);
          result.push(droppable);
          _this.data.droppables[droppable.id] = droppable;
        }
        return result;
      };
    })(this);
    this.get = function($injector) {
      this.setupEasing();
      this.setupProviders($injector);
      return {
        isMouseMoved: this.isMouseMoved,
        data: this.data,
        draggable: this.draggable,
        droppable: this.droppable
      };
    };
    this.get.$inject = ['$injector'];
    this.$get = this.get;
  });

}).call(this);

(function() {
  angular.module('builder', ['builder.directive']);
}).call(this);


/*
    component:
        It is like a class.
        The base components are textInput, textArea, select, check, radio.
        User can custom the form with components.
    formObject:
        It is like an object (an instance of the component).
        User can custom the label, description, required and validation of the input.
    form:
        This is for end-user. There are form groups int the form.
        They can input the value to the form.
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('builder.provider', []).provider('$builder', function() {
    var $http, $injector, $templateCache;
    $injector = null;
    $http = null;
    $templateCache = null;
    this.version = '0.0.2';
    this.components = {};
    this.groups = [];
    this.broadcastChannel = {
      updateInput: '$updateInput'
    };
    this.forms = {
      "default": []
    };
    this.formsId = {
      "default": 0
    };
    this.convertComponent = function(name, component) {
      var result, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      result = {
        name: name,
        group: (_ref = component.group) != null ? _ref : 'Default',
        label: (_ref1 = component.label) != null ? _ref1 : '',
        description: (_ref2 = component.description) != null ? _ref2 : '',
        placeholder: (_ref3 = component.placeholder) != null ? _ref3 : '',
        editable: (_ref4 = component.editable) != null ? _ref4 : true,
        required: (_ref5 = component.required) != null ? _ref5 : false,
        validation: (_ref6 = component.validation) != null ? _ref6 : '/.*/',
        validationOptions: (_ref7 = component.validationOptions) != null ? _ref7 : [],
        options: (_ref8 = component.options) != null ? _ref8 : [],
        arrayToText: (_ref9 = component.arrayToText) != null ? _ref9 : false,
        inputName : component.inputName,
        unique: component.unique,
        placedItems: 0,
        template: component.template,
        templateUrl: component.templateUrl,
        popoverTemplate: component.popoverTemplate,
        popoverTemplateUrl: component.popoverTemplateUrl
      };
      if (!result.template && !result.templateUrl) {
        console.error("The template is empty.");
      }
      if (!result.popoverTemplate && !result.popoverTemplateUrl) {
        console.error("The popoverTemplate is empty.");
      }
      return result;
    };
    this.convertFormObject = function(name, formObject) {
      var component, exist, form, result, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (formObject == null) {
        formObject = {};
      }
      component = this.components[formObject.component];
      if (component == null) {
        throw "The component " + formObject.component + " was not registered.";
      }

      //mark that an object of this component has been added to the page
      this.components[formObject.component].placedItems++;

      if (formObject.id) {
        exist = false;
        _ref = this.forms[name];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          form = _ref[_i];
          if (!(formObject.id <= form.id)) {
            continue;
          }
          formObject.id = this.formsId[name]++;
          exist = true;
          break;
        }
        if (!exist) {
          this.formsId[name] = formObject.id + 1;
        }
      }
      result = {
        id: (_ref1 = formObject.id) != null ? _ref1 : this.formsId[name]++,
        component: formObject.component,
        editable: (_ref2 = formObject.editable) != null ? _ref2 : component.editable,
        index: (_ref3 = formObject.index) != null ? _ref3 : 0,
        label: (_ref4 = formObject.label) != null ? _ref4 : component.label,
        description: (_ref5 = formObject.description) != null ? _ref5 : component.description,
        placeholder: (_ref6 = formObject.placeholder) != null ? _ref6 : component.placeholder,
        options: (_ref7 = formObject.options) != null ? _ref7 : component.options,
        required: (_ref8 = formObject.required) != null ? _ref8 : component.required,
        validation: (_ref9 = formObject.validation) != null ? _ref9 : component.validation,
        inputName: component.inputName
      };

      if (typeof formObject.defaultValues == 'object') {
        Object.keys(formObject.defaultValues).forEach(function(name){
          result[name] = formObject.defaultValues[name];
        });
      }
      return result;
    };
    this.reindexFormObject = (function(_this) {
      return function(name) {
        var formObjects, index, _i, _ref;
        formObjects = _this.forms[name];
        for (index = _i = 0, _ref = formObjects.length; _i < _ref; index = _i += 1) {
          formObjects[index].index = index;
        }
      };
    })(this);
    this.setupProviders = (function(_this) {
      return function(injector) {
        $injector = injector;
        $http = $injector.get('$http');
        return $templateCache = $injector.get('$templateCache');
      };
    })(this);
    this.loadTemplate = function(component) {

      /*
      Load template for components.
      @param component: {object} The component of $builder.
       */
      if (component.template == null) {
        $http.get(component.templateUrl, {
          cache: $templateCache
        }).success(function(template) {
          return component.template = template;
        });
      }
      if (component.popoverTemplate == null) {
        return $http.get(component.popoverTemplateUrl, {
          cache: $templateCache
        }).success(function(template) {
          return component.popoverTemplate = template;
        });
      }
    };
    this.registerComponent = (function(_this) {
      return function(name, component) {
        var newComponent, _ref;
        if (component == null) {
          component = {};
        }

        /*
        Register the component for form-builder.
        @param name: The component name.
        @param component: The component object.
            group: {string} The component group.
            label: {string} The label of the input.
            description: {string} The description of the input.
            placeholder: {string} The placeholder of the input.
            editable: {bool} Is the form object editable?
            required: {bool} Is the form object required?
            validation: {string} angular-validator. "/regex/" or "[rule1, rule2]". (default is RegExp(.*))
            validationOptions: {array} [{rule: angular-validator, label: 'option label'}] the options for the validation. (default is [])
            options: {array} The input options.
            arrayToText: {bool} checkbox could use this to convert input (default is no)
            template: {string} html template
            templateUrl: {string} The url of the template.
            popoverTemplate: {string} html template
            popoverTemplateUrl: {string} The url of the popover template.
         */
        if (_this.components[name] == null) {
          newComponent = _this.convertComponent(name, component);
          _this.components[name] = newComponent;
          if ($injector != null) {
            _this.loadTemplate(newComponent);
          }
          if (_ref = newComponent.group, __indexOf.call(_this.groups, _ref) < 0) {
            _this.groups.push(newComponent.group);
          }
        } else {
          console.error("The component " + name + " was registered.");
        }
      };
    })(this);
    this.addFormObject = (function(_this) {
      return function(name, formObject) {
        var _base;
        if (formObject == null) {
          formObject = {};
        }

        /*
        Insert the form object into the form at last.
         */
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [];
        }
        return _this.insertFormObject(name, _this.forms[name].length, formObject);
      };
    })(this);
    this.insertFormObject = (function(_this) {
      return function(name, index, formObject) {
        var _base, _base1;
        if (formObject == null) {
          formObject = {};
        }

        /*
        Insert the form object into the form at {index}.
        @param name: The form name.
        @param index: The form object index.
        @param form: The form object.
            id: {int} The form object id. It will be generate by $builder if not asigned.
            component: {string} The component name
            editable: {bool} Is the form object editable? (default is yes)
            label: {string} The form object label.
            description: {string} The form object description.
            placeholder: {string} The form object placeholder.
            options: {array} The form object options.
            required: {bool} Is the form object required? (default is no)
            validation: {string} angular-validator. "/regex/" or "[rule1, rule2]".
            [index]: {int} The form object index. It will be updated by $builder.
        @return: The form object.
         */
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [];
        }
        if ((_base1 = _this.formsId)[name] == null) {
          _base1[name] = 0;
        }
        if (index > _this.forms[name].length) {
          index = _this.forms[name].length;
        } else if (index < 0) {
          index = 0;
        }
        _this.forms[name].splice(index, 0, _this.convertFormObject(name, formObject));
        _this.reindexFormObject(name);
        return _this.forms[name][index];
      };
    })(this);
    this.removeFormObject = (function(_this) {
      return function(name, index) {

        /*
        Remove the form object by the index.
        @param name: The form name.
        @param index: The form object index.
         */
        var formObjects;
        formObjects = _this.forms[name];

        //mark that an object of this component has been removed from the page
        _this.components[formObjects[index].component].placedItems--;

        formObjects.splice(index, 1);

        return _this.reindexFormObject(name);
      };
    })(this);
    this.updateFormObjectIndex = (function(_this) {
      return function(name, oldIndex, newIndex) {

        /*
        Update the index of the form object.
        @param name: The form name.
        @param oldIndex: The old index.
        @param newIndex: The new index.
         */
        var formObject, formObjects;
        if (oldIndex === newIndex) {
          return;
        }
        formObjects = _this.forms[name];
        formObject = formObjects.splice(oldIndex, 1)[0];
        formObjects.splice(newIndex, 0, formObject);
        return _this.reindexFormObject(name);
      };
    })(this);
    this.$get = [
      '$injector', (function(_this) {
        return function($injector) {
          var component, name, _ref;
          _this.setupProviders($injector);
          _ref = _this.components;
          for (name in _ref) {
            component = _ref[name];
            _this.loadTemplate(component);
          }
          return {
            version: _this.version,
            components: _this.components,
            groups: _this.groups,
            forms: _this.forms,
            broadcastChannel: _this.broadcastChannel,
            registerComponent: _this.registerComponent,
            addFormObject: _this.addFormObject,
            insertFormObject: _this.insertFormObject,
            removeFormObject: _this.removeFormObject,
            updateFormObjectIndex: _this.updateFormObjectIndex
          };
        };
      })(this)
    ];
  });

}).call(this);