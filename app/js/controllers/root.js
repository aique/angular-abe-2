angular.module('app')
    .controller('RootController', ['$scope', '$modal', 'workoutHistoryTracker', function($scope, $modal)
    {
        $scope.showWorkoutHistory = function()
        {
            var dailog = $modal.open(
            {
                templateUrl: 'partials/workoutrunner/workoutrunner-history.html',
                controller: 'WorkoutHistoryController',
                size: 'lg'
            });
        };

        // En cada cambio de ruta pasa el valor actual de la ruta al ámbito para poder mostrar los menús adecuadamente

        $scope.$on('$routeChangeSuccess', function(e, current, previous, error)
        {
            $scope.currentRoute = current;
            $scope.routeHasError = false;
        });

        $scope.$on('$routeChangeError', function(e, current, previous, error)
        {
            $scope.routeHasError = true;

            if(error.status == 404)
            {
                $scope.routeError = current.routeErrorMessage;
            }
        });
    }]);
