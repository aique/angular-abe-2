angular.module('app').directive('ngConfirm', [function ()
{
    return {
        restrict: 'A',
        link: function (scope, element, attrs)
        {
            element.bind('click', function ()
            {
                var message = attrs.ngConfirmMessage || 'Are you sure?';

                if(message && confirm(message))
                {
                    scope.$apply(attrs.ngConfirm);
                };
            });
        }
    }
}]);

angular.module('app').directive('owlCarousel', ['$compile', '$timeout', function($compile, $timeout)
{
    var owl = null;

    return {
        scope:
        {
            options: '=',
            source: '=',
            onUpdate: '&' // tunelado de eventos
        },
        link: function(scope, element, attr)
        {
            var defaultOptions = {
                singleItem: true,
                pagination: true,
                afterAction: function()
                {
                    var itemIndex = this.currentItem;

                    scope.$evalAsync(function()
                    {
                        scope.onUpdate({currentItemIndex: itemIndex})
                    })
                }
            };

            if(scope.options)
            {
                angular.extend(defaultOptions, scope.options);
            }

            // se observa la colección de imágenes para ejecutar el siguiente código una vez esté disponible

            scope.$watch('source', function(newValue)
            {
                if(newValue)
                {
                    // usando la función $timeout la ejecución de este código espera a que la directiva ng-repeat concluya su ejecución

                    $timeout(function()
                    {
                        owl = element.owlCarousel(defaultOptions);
                    }, 0);
                }
            });
        },
        controller: ['$scope', '$attrs', function($scope, $attrs)
        {
            if($attrs.owlCarousel)
            {
                $scope.$parent[$attrs.owlCarousel] = this; // se asigna el controlador a la variable $scope.carousel del ámbito del padre
            }

            // métodos disponibles mediante $scope.carousel a los que se podrá llamar desde el controlador de la rutina

            this.next = function()
            {
                owl.trigger('owl.next');
            };

            this.previous = function()
            {
                owl.trigger('owl.prev');
            };
        }]
    }
}]);