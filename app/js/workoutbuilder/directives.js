angular.module('workoutbuilder')
    .directive('workoutTitle', function()
    {
        return {
            restrict: 'E', // naturaleza de la directiva, en este caso será una etiqueta HTML
            templateUrl: 'partials/workoutbuilder/workout-title.html' // plantilla que usará la directiva
        }
    });

// código de la directiva para las versiones previas a la v1.3

/*
angular.module('workoutbuilder')
    .directive('remoteValidator', ['$parse', function($parse)
    {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl)
            {
                var validatorFunction = $parse(attr['remoteValidatorFunction']);
                var validatorName = attr['remoteValidator'];

                // al añadir esta funcion a los validadores del elemento, será invocada cada vez que el valor del input cambia

                ngModelCtrl.$parsers.push(function(value)
                {
                    var result = validatorFunction(scope, {'value': value})

                    // si el objeto promise ya ha devuelto respuesta entra en la condición

                    if(result.then)
                    {
                        result.then(
                            function(data)
                            {
                                ngModelCtrl.$setValidity(validatorName, true);
                            },
                            function(error)
                            {
                                ngModelCtrl.$setValidity(validatorName, false);
                            })
                    }

                    return value;
                })
            }
        }
    }]);
*/

// código de la directiva para las versiones previas a la v1.3

angular.module('workoutbuilder')
    .directive('remoteValidator', ['$parse', function($parse)
    {
        return {
            // el símbolo ?^indica que buscará la dependencia en el elemento HTML padre
            require: ['ngModel', '?^busyIndicator'],
            link: function(scope, element, attr, ctrls) // el cuarto parámetro va relacionado con el valor del atributo require
            {
                var validatorFunction = $parse(attr['remoteValidatorFunction']);
                var validatorName = attr['remoteValidator'];

                var ngModelCtrl = ctrls[0];
                var busyIndicator = ctrls[1];

                // al añadir esta funcion a los validadores del elemento, será invocada cada vez que el valor del input cambia

                ngModelCtrl.$asyncValidators[validatorName] = function(value)
                {
                    // no hace falta llamar al método setValidity ya que se establece con la respuesta del objeto promise

                    return validatorFunction(scope, {'value': value});
                };

                if(busyIndicator)
                {
                    scope.$watch(
                        function()
                        {
                            return ngModelCtrl.$pending; // esta función refleja el estado de todas las validaciones asíncronas pendientes de respuesta en un array asociativo
                        },
                        function(newValue)
                        {
                            // si $pending ha devuelto algo y dentro del array existe un valor para la validación que se está comprobando es que aún está pendiente de respuesta

                            if(newValue && newValue[validatorName])
                            {
                                busyIndicator.show();
                            }
                            else
                            {
                                busyIndicator.hide();
                            }
                        });
                }
            }
        }
    }]);

angular.module('workoutbuilder')
    .directive('busyIndicator', function($compile)
    {
        return {
            scope: true,

            // primera versión en la que la plantilla se insertaba mediante la función link

            /*
            link: function(scope, element, attr)
            {
                // se utiliza el servicio $compile para añadir código HTML sobre el que ha de actuar una directiva (ng-show)

                var linkFunction = $compile('<div><label ng-show="busy" class="text-info glyphicon glyphicon-refresh spin"></label></div>');

                element.append(linkFunction(scope));
            },
            */

            // segunda versión en la que utilizamos el atributo template junto con transclude, que permite disponer
            // del HTML de los elementos que se encuentran dentro de aquel sobre el que se ha definido la directiva
            // dentro del bloque con la directiva ng-transclude, para controlar así donde meter el código de la plantilla

            transclude: true,
            template: '<div><div ng-transclude=""></div><label ng-show="busy" class="text-info glyphicon glyphicon-refresh spin busy-indicator"></label></div>',

            controller: ['$scope', function($scope)
            {
                this.show = function()
                {
                    $scope.busy = true;
                };

                this.hide = function()
                {
                    $scope.busy = false;
                };
            }]
        }
    });

angular.module('app')
    .directive('ajaxButton', function()
    {
        return {
            restrict: 'E',
            scope:
            {
                onClick: '&',
                submitting: '@'
            },
            replace: true, // sustituye el propio elemento por la plantilla, en lugar de incrustarla dentro de él (atributo obsoleto en las recientes versiones)
            transclude: true, // se utiliza para mostrar el texto visible del botón en el lugar indicado dentro de la plantilla
            template: '<button ng-disabled="busy"><span class="glyphicon glyphicon-refresh spin" ng-show="busy"></span><span ng-transclude=""></span></button>',
            link: function(scope, element, attr)
            {
                if(attr.submitting != undefined && attr.submitting != null)
                {
                    attr.$observe('submitting', function(value)
                    {
                        if(value)
                        {
                            scope.busy = JSON.parse(value);
                        }
                    });
                }

                if(attr.onClick)
                {
                    element.on('click', function(event)
                    {
                        scope.$apply(function()
                        {
                            var result = scope.onClick();

                            if(attr.submitting != undefined && attr.submitting != null)
                            {
                                return;
                            }

                            if(result.finally)
                            {
                                scope.busy = true;

                                result.finally(function()
                                {
                                    scope.busy = false;
                                });
                            }
                        })
                    })
                }
            }
        };
    });