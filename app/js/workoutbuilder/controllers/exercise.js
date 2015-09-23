
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
    .controller('ExerciseDetailController', ['$scope', '$routeParams', '$location', '$q', 'WorkoutService', 'ExerciseBuilderService', 'selectedExercise',
        function($scope, $routeParams, $location, $q, WorkoutService, ExerciseBuilderService, selectedExercise)
    {
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

            var exercise = WorkoutService.Exercises.get({id: value.toLowerCase()});

            return exercise.$promise.then(
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

        $scope.canDeleteExercise = function()
        {
            return !ExerciseBuilderService.newExercise;
        };

        $scope.deleteExercise = function()
        {
            if(!ExerciseBuilderService.newExercise)
            {
                ExerciseBuilderService.deleteExercise().then(function(response)
                {
                    if(response)
                    {
                        $location.path('/builder/exercises');
                    };
                });
            }
        };

        $scope.save = function()
        {
            if($scope.formExercise.$invalid)
            {
                return;
            }

            $scope.submitted = true; // a partir de la versión 1.3 el controlador del formulario ya posee una variable $submitted

            if(!$scope.formExercise.$invalid) // se realiza una validación a nivel de formulario
            {
                ExerciseBuilderService.save().then(function(exercise)
                {
                    $scope.exercise = exercise;
                    $scope.formExercise.$setPristine(); // se actualiza el estado del formulario a no manipulado, extendiendo este estado a todos los elementos que componen el formulario
                    $scope.submitted = false;
                });
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