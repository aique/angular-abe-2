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
    .controller('WorkoutDetailController', ['$scope', '$routeParams', '$q', '$location', 'WorkoutService', 'WorkoutBuilderService', 'selectedWorkout',
        function($scope, $routeParams, $q, $location, WorkoutService, WorkoutBuilderService, selectedWorkout)
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

        /**
         * Función utilizada para realizar la comprobación de que el nombre de la rutina
         * es único dentro de la base de datos, ya que será utilizado como identificador.
         *
         * Es utilizada por la directiva propia definida para llevar a cabo validaciones
         * en el formulario mediante consultas remotas a la base de datos.
         *
         * Devuelve un objeto promise que el validador deberá de resolver.
         */
        $scope.uniqueUserName = function(value)
        {
            // si el nombre es vacío o es igual que el pasado como parámetro (en caso de edición) pasará la validación

            if(!value || value == $routeParams.id)
            {
                return $q.when(true); // fuerza a la devolución de un objeto de tipo promise con la respuesta pasada como parámetro
            }

            return WorkoutService.getWorkout(value.toLowerCase()).then(
                function(data)
                {
                    return $q.reject(); // respuesta en caso de que la llamada encuentre una rutina en base de datos
                },
                function(error)
                {
                    return true; // respuesta en caso de que la llamada no encuentre una rutina en base de datos
                });
        };

        $scope.isDirty = function(modelController)
        {
            return modelController.$dirty || $scope.submitted;
        };

        $scope.hasError = function(modelController, error)
        {
            return $scope.isDirty(modelController) && error;
        };

        $scope.save = function()
        {
            if($scope.formWorkout.$invalid)
            {
                return;
            }

            $scope.submitted = true; // a partir de la versión 1.3 el controlador del formulario ya posee una variable $submitted

            if(!$scope.formWorkout.$invalid) // se realiza una validación a nivel de formulario
            {
                WorkoutBuilderService.save().then(function(workout)
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

        $scope.deleteWorkout = function()
        {
            if(!WorkoutBuilderService.newWorkout)
            {
                WorkoutBuilderService.deleteWorkout().then(function(response)
                {
                    if(response)
                    {
                        $location.path('/builder/workouts');
                    };
                });
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