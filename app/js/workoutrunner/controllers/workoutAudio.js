angular.module('workoutrunner').controller('WorkoutAudioController', ['$scope', '$timeout',
    function($scope, $timeout)
    {
        $scope.exercisesAudio = [];

        // Se consulta la propiedad workoutPlan del scope del controlador padre para detectar cambios en su estado
        // y saber así que la rutina se ha creado, momento en el cual se cargarán los audios de cada ejercicio en el array

        var workoutPlanWatch = $scope.$watch('workoutPlan', function(newValue, oldValue)
        {
            if(newValue)
            {
                angular.forEach($scope.workoutPlan.exercises, function(exercise)
                {
                    $scope.exercisesAudio.push(
                        {
                            src: exercise.details.nameSound,
                            type: 'audio/wav'
                        });
                });

                workoutPlanWatch(); // se elimina el observador
            }
        });

        // Añadimos un evento para el momento en el que cambia el ejercicio actual

        $scope.$watch('currentExercise', function(newValue, oldValue)
        {
            if(newValue && newValue !== oldValue)
            {
                if($scope.currentExercise.details.name !== 'rest')
                {
                    $timeout(function(){$scope.nextUpAudio.play();}, 2000); // anuncia el comienzo de un ejercicio
                    $timeout(function(){$scope.nextUpExerciseAudio.play($scope.currentExerciseIndex, true)}, 3000); // cita el nombre del ejercicio que está comenzando
                }
            }
        });

        $scope.$watch('currentExerciseDuration', function(newValue, oldValue)
        {
            if(newValue)
            {
                if(newValue == Math.floor($scope.currentExercise.duration / 2) && $scope.currentExercise.details.name !== 'rest')
                {
                    $scope.halfWayAudio.play(); // indicador de que nos encontramos a mitad de ejercicio
                }
                else
                {
                    if(newValue == $scope.currentExercise.duration - 3)
                    {
                        $scope.aboutToCompleteAudio.play(); // cuenta atrás para los últimos 3 segundos del ejercicio
                    }
                }
            }
        });

        $scope.$watch('workoutPaused', function(newValue, oldValue)
        {
            if(newValue == true)
            {
                $scope.ticksAudio.stop();
            }
            else
            {
                $scope.ticksAudio.play();
            }
        });

        var init = function()
        {

        };

        init();
    }]);