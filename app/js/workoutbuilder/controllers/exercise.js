angular.module('workoutbuilder')
    .controller('ExercisesNavController', ['$scope', 'WorkoutService', 'WorkoutBuilderService', function ($scope, WorkoutService, WorkoutBuilderService)
    {
        $scope.addExercise = function(exercise)
        {
            WorkoutBuilderService.addExercise(exercise);
        };

        var init = function ()
        {
            $scope.exercises = WorkoutService.getExercises();
        };

        init();
    }]);

angular.module('workoutbuilder')
    .controller('ExerciseListController', ['$scope', '$location', 'WorkoutService', function($scope, $location, WorkoutService)
    {
        // lleva al detalle cuando se hace doble click sobre el ítem del ejercicio

        $scope.goto = function(exercise)
        {
            $location.path('/builder/exercises/' + exercise.name);
        }

        var init = function()
        {
            $scope.exercises = WorkoutService.getExercises();
        };

        init();
    }]);