angular.module('app')
    .controller('RootController', ['$scope', '$modal', 'workoutHistoryTracker', function($scope, $modal)
    {
        $scope.showWorkoutHistory = function()
        {
            var dailog = $modal.open(
            {
                templateUrl: 'partials/workoutrunner/workout-history.html',
                controller: 'WorkoutHistoryController',
                size: 'lg'
            });
        };

        // En cada cambio de ruta pasa el valor actual de la ruta al ámbito para poder mostrar los menús adecuadamente

        $scope.$on('$routeChangeSuccess', function(e, current, previous, error)
        {
            $scope.currentRoute = current;
            $scope.routeHasError = false;

            if(current.originalPath.indexOf('builder') > 0)
            {
                $scope.builder = true;
            }
            else
            {
                $scope.builder = false;
            }
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
