angular.module('app')
    .controller('WorkoutHistoryController', ['$scope', '$modalInstance', 'workoutHistoryTracker', function($scope, $modalInstance, workoutHistoryTracker)
    {
        $scope.search = {};
        $scope.search.completed = '';
        $scope.history = workoutHistoryTracker.getHistory();

        $scope.ok = function ()
        {
            $modalInstance.close();
        };
    }]);
