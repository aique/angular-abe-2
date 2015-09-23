
angular.module('workoutrunner').controller('WorkoutStartController', ["$scope", "$location", "WorkoutService",
    function($scope, $location, WorkoutService)
    {
        $scope.goto = function(workout)
        {
            $location.path('/workout/' + workout.name);
        };

        var init = function()
        {
            WorkoutService.getWorkouts().then(function(workouts)
            {
                $scope.workouts = workouts;
            });
        };

        init();
    }]);

angular.module('workoutrunner').controller('WorkoutController', ["$scope", "$interval", "$location", "workoutHistoryTracker", "selectedWorkout",
    function($scope, $interval, $location, workoutHistoryTracker, selectedWorkout)
    {
        var restExercise; // definición del ejercicio de descanso
        var exerciseIntervalPromise; // almacenará el promise devuelto por $interval para poder pausar el servicio

        var startWorkout = function(workout)
        {
            $scope.workoutPlan = workout; // inicializa la rutina
            $scope.currentExerciseIndex = -1;

            restExercise = {
                details: new Exercise({
                    name: 'rest',
                    title: 'Relájate!',
                    description: 'Tómate un respiro!',
                    image: 'img/rest.png'
                }),
                duration: $scope.workoutPlan.restBetweenExercise
            }; // crea el ejercicio de descanso

            $scope.workoutDuration = totalWorkoutDuration($scope.workoutPlan);

            // indica al servicio que ha de comenzar con el registro de la rutina

            workoutHistoryTracker.startTracking();

            // crea el array de imágenes para el carrusel

            fillImages();

            // inicializa la rutina sacando el primer ejercicio de la colección y pasándolo como parámetro

            startExercise($scope.workoutPlan.exercises[++$scope.currentExerciseIndex]);
        };

        var totalWorkoutDuration = function(workoutPlan)
        {
            if(workoutPlan.exercises.length == 0)
            {
                return 0;
            }

            var total = 0;

            angular.forEach(workoutPlan.exercises, function(exercise)
            {
                total = total + exercise.duration;
            });

            return total + workoutPlan.restBetweenExercise * (workoutPlan.exercises.length - 1);
        };

        var startExercise = function(exercise)
        {
            $scope.currentExercise = exercise;
            $scope.currentExerciseDuration = 0;

            // se incorpora la funcionalidad de pausar la rutina

            exerciseIntervalPromise = startExerciseTimeTracking();
        };

        var startExerciseTimeTracking = function()
        {
            var promise = $interval(function()
            {
                ++$scope.currentExerciseDuration;
                --$scope.workoutDuration;
            }, 1000, $scope.currentExercise.duration - $scope.currentExerciseDuration); // la duración del intervalo será el tiempo restante del ejercicio

            promise.then(function()
            {
                // Se dispara el evento de cambio de ejercicio para que se pueda registrar en el trakeo de la rutina

                if($scope.currentExercise.details.name != 'rest')
                {
                    $scope.$emit('event:workoutrunner:exerciseStarted', $scope.currentExercise.details);
                }

                var next = getNextExercise($scope.currentExercise);

                if(next)
                {
                    $scope.carousel.next();

                    startExercise(next);
                }
                else
                {
                    workoutComplete();
                }
            });

            return promise;
        };

        var workoutComplete = function()
        {
            // indica al servicio que la rutina ha finalizado satisfactoriamente

            workoutHistoryTracker.endTracking(true);

            $location.path('/finish');
        };

        var getNextExercise = function(currentExercise)
        {
            var nextExercise = null;

            if(currentExercise === restExercise)
            {
                nextExercise = $scope.workoutPlan.exercises[++$scope.currentExerciseIndex];
            }
            else
            {
                if($scope.currentExerciseIndex < $scope.workoutPlan.exercises.length - 1)
                {
                    nextExercise = restExercise;
                }
            }

            return nextExercise;
        };

        $scope.pauseWorkout = function()
        {
            $interval.cancel(exerciseIntervalPromise);
            $scope.workoutPaused = true;
        };

        $scope.resumeWorkout = function()
        {
            exerciseIntervalPromise = startExerciseTimeTracking();
            $scope.workoutPaused = false;
        };

        $scope.pauseResumeToggle = function()
        {
            if($scope.workoutPaused)
            {
                $scope.resumeWorkout();
            }
            else
            {
                $scope.pauseWorkout();
            }
        };

        $scope.onKeyPressed = function(event)
        {
            // si se ha pulsado la tecla 'p' o 'P' se pausa la rutina

            if(event.which == 80 || event.which == 112)
            {
                $scope.pauseResumeToggle();
            }
        };

        $scope.imageUpdated = function(imageIndex)
        {
            console.log($scope.exerciseImages[imageIndex]);
        };

        /**
         * Obtiene todas las imágenes de la rutina en un array para
         * que el plugin del carrusel pueda funcionar adecuadamente.
         */
        var fillImages = function()
        {
            $scope.exerciseImages = [];

            angular.forEach($scope.workoutPlan.exercises, function(exercise, index)
            {
                $scope.exerciseImages.push(exercise.details.image);

                if(index < $scope.workoutPlan.exercises.length - 1)
                {
                    // se inserta una imágen del ejercicio de descanso tras cada ejercicio

                    $scope.exerciseImages.push('img/rest.png');
                }
            });
        };

        var init = function()
        {
            if(selectedWorkout)
            {
                startWorkout(selectedWorkout);
            }
        };

        init(); // la definición e invocación de la función init es un convencionalismo para indicar dónde empieza la ejecución
    }]);