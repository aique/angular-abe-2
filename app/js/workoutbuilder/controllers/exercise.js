
// Controlador utilizado en la creación de una nueva rutina, para añadir los ejercicios que se encuentran en el menú lateral

angular.module('workoutbuilder')
    .controller('ExercisesNavController', ['$scope', 'WorkoutService', 'WorkoutBuilderService', function ($scope, WorkoutService, WorkoutBuilderService)
    {
        $scope.addExercise = function(exercise)
        {
            WorkoutBuilderService.addExercise(exercise);
        };

        var init = function ()
        {
            // obtención de la información relativa a los ejercicios mediante el servicio $http

            /*

            WorkoutService.getExercises().then(function(data)
            {
                $scope.exercises = data;
            });

            */

            // obtención de la información relativa a los ejercicios mediante el servicio $request

            $scope.exercises = WorkoutService.Exercises.query();
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
            // obtención de la información relativa a los ejercicios mediante el servicio $http

            /*

            WorkoutService.getExercises().then(function(data)
            {
                $scope.exercises = data;
            });

            */

            // obtención de la información relativa a los ejercicios mediante el servicio $request

            $scope.exercises = WorkoutService.Exercises.query();
        };

        init();
    }]);

angular.module('workoutbuilder')
    .controller('ExerciseDetailController', ['$scope', '$routeParams', 'ExerciseBuilderService', 'selectedExercise', function($scope, $routeParams, ExerciseBuilderService, selectedExercise)
    {
        $scope.isDirty = function(modelController)
        {
            return modelController.$dirty || $scope.submitted;
        };

        $scope.hasError = function(modelController, error)
        {
            return $scope.isDirty(modelController) && error;
        };

        $scope.save = function(exercise)
        {
            $scope.submitted = true; // a partir de la versión 1.3 el controlador del formulario ya posee una variable $submitted

            if(!$scope.formExercise.$invalid) // se realiza una validación a nivel de formulario
            {
                $scope.workout = ExerciseBuilderService.save(exercise);

                $scope.formExercise.$setPristine(); // se actualiza el estado del formulario a no manipulado, extendiendo este estado a todos los elementos que componen el formulario

                $scope.submitted = false;
            }
        };

        $scope.reset = function()
        {
            $scope.exercise = ExerciseBuilderService.startBuilding($routeParams.id);
            $scope.formExercise.$setPristine();
            $scope.submitted = false;
        };

        var init = function()
        {
            $scope.exercise = selectedExercise;
        };

        init();
    }]);