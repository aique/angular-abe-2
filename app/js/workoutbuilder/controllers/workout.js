angular.module('workoutbuilder')
    .controller('WorkoutListController', ['$scope', '$location', 'WorkoutService', function($scope, $location, WorkoutService)
    {
        // lleva al detalle cuando se hace doble click sobre el ítem de la rutina

        $scope.goto = function(workout)
        {
            $location.path('/builder/workouts/' + workout.name);
        };

        var init = function()
        {
            WorkoutService.getWorkouts().then(function(data)
            {
                $scope.workouts = data;
            });
        };

        init();
    }]);

// El parámetro selectedWorkout es pasado a través de la propiedad resolve dentro de la configuración de la ruta en app.js

angular.module('workoutbuilder')
    .controller('WorkoutDetailController', ['$scope', '$routeParams', 'WorkoutBuilderService', 'selectedWorkout', function($scope, $routeParams, WorkoutBuilderService, selectedWorkout)
    {
        // este método se ejecuta cuando el controlador del modelo está disponible, al entrar en la pantalla para comprobar que la rutina tiene al menos un ejercicio

        $scope.$watch('formWorkout.exerciseCount', function(newValue)
        {
            if(newValue)
            {
                newValue.$setValidity("count", $scope.workout.exercises.length > 0);
            }
        });

        // este método se ejecuta cuando hay un cambio en el modelo para comprobar que la rutina tiene al menos un ejercicio

        $scope.$watch('workout.exercises.length', function(newValue, oldValue)
        {
            if(newValue != oldValue)
            {
                $scope.formWorkout.exerciseCount.$dirty = true; // al añadir o eliminar un ejercicio el campo se da por manipulado
                $scope.formWorkout.$setDirty(); // al añadir o eliminar un ejercicio el formulario se da por manipulado
                $scope.formWorkout.exerciseCount.$setValidity("count", newValue > 0);
            }
        });

        $scope.moveExerciseTo = function(exercise, toIndex)
        {
            WorkoutBuilderService.moveExerciseTo(exercise, toIndex);
        };

        $scope.removeExercise = function(exercise)
        {
            WorkoutBuilderService.removeExercise(exercise);
        };

        $scope.isDirty = function(modelController)
        {
            return modelController.$dirty || $scope.submitted;
        };

        $scope.hasError = function(modelController, error)
        {
            return $scope.isDirty(modelController) && error;
        };

        $scope.save = function(workout)
        {
            $scope.submitted = true; // a partir de la versión 1.3 el controlador del formulario ya posee una variable $submitted

            if(!$scope.formWorkout.$invalid) // se realiza una validación a nivel de formulario
            {
                WorkoutBuilderService.save(workout).then(function(workout)
                {
                    $scope.workout = workout;
                    $scope.formWorkout.$setPristine(); // se actualiza el estado del formulario a no manipulado, extendiendo este estado a todos los elementos que componen el formulario
                    $scope.submitted = false;
                })
            }
        };

        $scope.canDeleteWorkout = function()
        {
            return !WorkoutBuilderService.newWorkout;
        };

        $scope.delete = function(workout)
        {
            if(!WorkoutBuilderService.newWorkout)
            {
                return WorkoutBuilderService.delete(workout);
            }
        };

        $scope.reset = function()
        {
            $scope.workout = WorkoutBuilderService.startBuilding($routeParams.id);
            $scope.formWorkout.$setPristine();
            $scope.submitted = false;
        };

        var init = function()
        {
            $scope.workout = selectedWorkout;

            $scope.durations = [{title: 10, value: 10}, {title: 20, value: 20}, {title: 30, value: 30}]; // array de posibles duraciones para cada ejercicio

            $scope.selectedExercise = {}; // ejercicio seleccionado dentro de la lista de ejercicios de cada rutina
        };

        init();
    }]);