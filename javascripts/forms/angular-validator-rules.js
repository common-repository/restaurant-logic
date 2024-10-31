(function() {
  angular.module('validator.rules', ['validator']).config([
    '$validatorProvider', function($validatorProvider) {
      $validatorProvider.register('required', {
        invoke: 'watch',
        validator: /.+/,
        error: 'This field is required.'
      });
      $validatorProvider.register('number', {
        invoke: 'watch',
        validator: /^$|^[-+]?[0-9]*[\.]?[0-9]*$/,
        error: 'This field should be a number.'
      });
      $validatorProvider.register('date-time', {
        invoke: 'watch',
        validator: /^$|^(0?[1-9]|1[012])\/([123]0|[012][1-9]|[1-9]|31)\/(19[0-9]{2}|2[0-9]{3}), ([01]?[0-9]|2[0-3]):([0-5][0-9]) ([a|p]m)$/i,
        error: 'This field should be a date and time (MM/dd/yyyy, hh:mm meridian).'
      });
      $validatorProvider.register('date', {
        invoke: 'watch',
        validator: /^$|^(0?[1-9]|1[012])\/([123]0|[012][1-9]|[1-9]|31)\/(19[0-9]{2}|2[0-9]{3})$/i,
        error: 'This field should be a date (MM/dd/yyyy).'
      });
      $validatorProvider.register('email', {
        invoke: 'blur',
        validator: /^$|^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        error: 'This field should be an email.'
      });
      $validatorProvider.register('customer-email', {
        invoke: 'blur',
        validator: /^$|^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\|\|(Yes|No)$/,
        error: 'This field should be an email.'
      });
      $validatorProvider.register('phone', {
        invoke: 'blur',
        validator: /^$|^\+?1?[-. ]*\(?[0-9]{3}\)?[-. ]*[0-9]{3}[-. ]*[0-9]{4}$/,
        error: 'This field should be a phone number.'
      });
      $validatorProvider.register('rating', {
          invoke: 'blur',
          validator: /^$|^[1-5]$/,
          error: 'This field is required.'
        });
      return $validatorProvider.register('url', {
        invoke: 'blur',
        validator: /^$|((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        error: 'This field should be a url.'
      });
    }
  ]);

}).call(this);
