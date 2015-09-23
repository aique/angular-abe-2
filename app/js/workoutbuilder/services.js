angular.module('app').value("appEvents",
{
    workout: {exerciseStarted: "event:workout:exerciseStarted"}
});

angular.module('workoutbuilder')
    .factory("WorkoutBuilderService", ['WorkoutService', '$q', function(WorkoutService, $q)
{
        var service = {};

        var buildingWorkout;

        // Devuelve la rutina para ser manipulada mediante el nombre de la misma, si la rutina no existe se creará una nueva

        service.startBuilding = function(name)
        {
            var defer = $q.defer();

            if(name)
            {
                WorkoutService.getWorkout(name).then(function(workout)
                {
                    buildingWorkout = workout;
                    service.newWorkout = false;
                    defer.resolve(buildingWorkout);
                });
            }
            else
            {
                buildingWorkout = new Workout({});
                defer.resolve(buildingWorkout);
                service.newWorkout = true;
            }

            return defer.promise;
        };

        service.removeExercise = function(exercise)
        {
            buildingWorkout.exercises.splice(buildingWorkout.exercises.indexOf(exercise), 1);
        };

        service.addExercise = function(exercise)
        {
            buildingWorkout.exercises.push({details: exercise, duration: 30});
        };

        service.moveExerciseTo = function(exercise, toIndex)
        {
            if(toIndex < 0 || toIndex >= buildingWorkout.exercises) return;

            var currentIndex = buildingWorkout.exercises.indexOf(exercise);

            buildingWorkout.exercises.splice(toIndex, 0, buildingWorkout.exercises.splice(currentIndex, 1)[0]);
        };

        service.save = function()
        {
            var promise;

            if(service.newWorkout)
            {
                promise = WorkoutService.addWorkout(buildingWorkout);
            }
            else
            {
                promise = WorkoutService.updateWorkout(buildingWorkout);
            }

            promise.then(function(workout)
            {
                service.newWorkout = false; // una vez que se guarda la rutina la variable se establece a false
            });

            return promise;
        };

        service.deleteWorkout = function()
        {
            return WorkoutService.deleteWorkout(buildingWorkout);
        };

        return service;
    }]);

angular.module('workoutbuilder')
    .factory("ExerciseBuilderService", ['WorkoutService', function(WorkoutService)
    {
        var service = {};

        var buildingExercise;

        // Devuelve el ejercicio para ser manipulado mediante el nombre del mismo, si el ejercicio no existe se creará uno nuevo

        service.startBuilding = function(name)
        {
            if(name)
            {
                buildingExercise = WorkoutService.Exercises.get({id: name}, function(data)
                {
                    service.newExercise = false;
                });
            }
            else
            {
                buildingExercise = new Exercise({});
                service.newExercise = true;
            }

            return buildingExercise;
        };

        service.save = function()
        {
            if(!buildingExercise._id)
            {
                buildingExercise._id = buildingExercise.name;
            }

            var promise;

            if(service.newExercise)
            {
                buildingExercise = WorkoutService.Exercises.save({}, buildingExercise);

                promise = buildingExercise.$promise;
            }
            else
            {
                promise = buildingExercise.$update({id: buildingExercise.name});
            }

            return promise.then(function(data)
            {
                service.newExercise = false;

                return buildingExercise;
            });
        };

        service.deleteExercise = function()
        {
            return buildingExercise.$delete({id: buildingExercise.name});
        }

        return service;
    }]);