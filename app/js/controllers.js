
// Controlador principal

angular.module('7MinutesWorkout').controller('WorkoutController',
["$scope", "$interval", function($scope, $interval)
{
    var restExercise;
    var workoutPlan;

    var startWorkout = function()
    {
        workoutPlan = createWorkout(); // inicializa la rutina

        restExercise = {
            details: new Exercise({
                name: 'rest',
                title: 'Relájate!',
                description: 'Tómate un respiro!',
                image: 'app/img/rest.png'
            }),
            duration: workoutPlan.restBetweenExercise
        }; // crea el ejercicio de descanso

        // inicializa la rutina sacando el primer ejercicio de la colección y pasándolo como parámetro

        startExercise(workoutPlan.exercises.shift());
    };

    var startExercise = function(exercise)
    {
        $scope.currentExercise = exercise;
        $scope.currentExerciseDuration = 0;

        // se utiliza el servicio $interval de Angularjs para llamar a una función en intervalos específicos

        // versión 1: se utiliza un listener

        /*

        $interval(function()
        {
            ++$scope.currentExerciseDuration;
        }, 1000, exercise.duration);

        // añade un listener sobre una propiedad específica, la función se ejecuta cuando la propiedad cambia de valor

        $scope.$watch('currentExerciseDuration', function(newVal, oldVal, $scope)
        {
            if(newVal === $scope.currentExercise.duration)
            {
                var next = getNextExercise($scope.currentExercise);

                if(next)
                {
                    startExercise(next);
                }
                else
                {
                    console.log('Rutina completada!');
                }
            }
        });

        */

        // versión 2: se utiliza la API Promise de Angularjs, teniendo en cuenta que $interval devuelve un objeto promise

        $interval(function()
        {
            ++$scope.currentExerciseDuration;
        },1000, exercise.duration).then(function()
        {
            var next = getNextExercise($scope.currentExercise);

            if(next)
            {
                startExercise(next);
            }
            else
            {
                console.log('Rutina completada!');
            }
        });
    };

    var getNextExercise = function(currentExercise)
    {
        var nextExercise = null;

        if(currentExercise === restExercise)
        {
            nextExercise = workoutPlan.exercises.shift();
        }
        else
        {
            if(workoutPlan.exercises.length != 0)
            {
                nextExercise = restExercise;
            }
        }

        return nextExercise;
    }

    var createWorkout = function()
    {
        var workout = new Workout({
            name: '7MinutesWorkout',
            title: '7 Minute Workout',
            restBetweenExercise: 10
        });

        workout.exercises.push({
            details: new Exercise({
                name: 'jumpingJacks',
                title: 'Jumping Jacks',
                description: 'Jumping Jacks.',
                image: 'app/img/JumpingJacks.png',
                videos: [],
                variations: [],
                procedure: ''
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "wallSit",
                title: "Wall Sit",
                description: "Wall Sit.",
                image: "app/img/wallsit.png",
                videos: [],
                variations: [],
                procedure: ""

            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "pushUp",
                title: "Push Up",
                description: "Discription about pushup.",
                image: "app/img/pushup.png",
                videos: ["https://www.youtube.com/watch?v=Eh00_rniF8E", "https://www.youtube.com/watch?v=ZWdBqFLNljc", "https://www.youtube.com/watch?v=UwRLWMcOdwI", "https://www.youtube.com/watch?v=ynPwl6qyUNM", "https://www.youtube.com/watch?v=OicNTT2xzMI"],
                variations: ["Planche push-ups", "Knuckle push-ups", "Maltese push-ups", "One arm versions"],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "crunches",
                title: "Abdominal Crunches",
                description: "Abdominal Crunches.",
                image: "app/img/crunches.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "stepUpOntoChair",
                title: "Step Up Onto Chair",
                description: "Step Up Onto Chair.",
                image: "app/img/stepUpOntoChair.jpeg",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "squat",
                title: "Squat",
                description: "Squat.",
                image: "app/img/squat.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "tricepdips",
                title: "Tricep Dips On Chair",
                description: "Tricep Dips On Chair.",
                image: "app/img/tricepdips.jpg",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "plank",
                title: "Plank",
                description: "Plank.",
                image: "app/img/plank.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "highKnees",
                title: "High Knees",
                description: "High Knees.",
                image: "app/img/highknees.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "lunges",
                title: "Lunges",
                description: "Lunges.",
                image: "app/img/lunges.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "pushupNRotate",
                title: "Pushup And Rotate",
                description: "Pushup And Rotate.",
                image: "app/img/pushupNRotate.jpg",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        workout.exercises.push({
            details: new Exercise({
                name: "sidePlank",
                title: "Side Plank",
                description: "Side Plank.",
                image: "app/img/sideplank.png",
                videos: [],
                variations: [],
                procedure: ""
            }),
            duration: 30
        });

        return workout;
    };

    var init = function()
    {
        startWorkout();
    };

    init(); // la definición e invocación de la función init es un convencionalismo para indicar dónde empieza la ejecución
}]);
