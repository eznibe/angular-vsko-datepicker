
module.exports =
  [ '$filter', function ($filter) {

    var dateFilter = function (date) {
      return $filter('date')(date, "dd/MM/yyyy");
    };

    return {
      restrict: 'EA',
      scope: {
        'date': '=dateModel',
        'name': '@',
        'required': '=',
        'orientation': '@',
        'onChange': '='
      },
      template:
      '<ng-form name={{name}}><div class="input-group date mydate"><input ng-blur="blur()" ng-model="dateInput" type="text" class="form-control myclass"/><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></ng-form>',
      link: function (scope, elem, attr) {

        var dpElem = $(elem[0].childNodes[0].childNodes[0]);

        dpElem.datepicker({
          format: 'dd/mm/yyyy',
          todayBtn: 'linked',
          language: "nl-BE",
          autoclose: true,
          todayHighlight: true,
          orientation: scope.orientation ? scope.orientation : 'top auto'
        });

        dpElem.datepicker().on('changeDate', function (e) {
          // console.log('New date value', e.date);
          scope.$apply(function () {
            scope.date = e.format(0, 'yyyy-mm-dd');
          });
          if (scope.onChange) {
            scope.onChange();
          }
        });

        scope.blur = function() {
          scope[scope.name].$touched = true;
        };

        scope.$watch('dateInput', function(n, o) {
          if(o && !n) {
            scope.date = undefined;
          }
        });

        scope.$watch('date', function(value) {

          var valid = true;
          if(scope.required && !value) {
            valid = false;
          }
          scope[scope.name].$setValidity('required', valid);
          if(value && value!="" && !$(dpElem).datepicker('getDate')) {
            dpElem.datepicker('update', dateFilter(value));
          }
        });
      }
    }
  }];
