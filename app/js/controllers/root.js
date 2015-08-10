angular.module('app')
    .controller('RootController', ['$scope', '$modal', 'workoutHistoryTracker', function($scope, $modal)
    {
        $scope.showWorkoutHistory = function()
        {
            var dailog = $modal.open(
            {
                templateUrl: 'partials/workout/workout-history.html',
                controller: 'WorkoutHistoryController',
                size: 'lg'
            });
        };
    }]);
