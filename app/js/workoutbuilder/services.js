angular.module('app').value("appEvents",
{
    workout: {exerciseStarted: "event:workout:exerciseStarted"}
});

angular.module('workoutbuilder')
    .factory("WorkoutBuilderService", ['WorkoutService', function(WorkoutService)
{
        var service = {};
        var buildingWorkout;
        var newWorkout;

        // Devuelve la rutina para ser manipulada mediante el nombre de la misma, si la rutina no existe se creará una nueva

        service.startBuilding = function(name)
        {
            if(name)
            {
                buildingWorkout = WorkoutService.getWorkout(name);
                newWorkout = false;
            }
            else
            {
                buildingWorkout = new Workout({});
                newWorkout = true;
            }

            return buildingWorkout;
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
            var workout;

            if(newWorkout)
            {
                workout = WorkoutService.addWorkout(buildingWorkout);
            }
            else
            {
                workout = WorkoutService.updateWorkout(buildingWorkout);
            }

            newWorkout = false;

            return workout;
        };

        return service;
    }]);

angular.module('workoutbuilder')
    .factory("ExerciseBuilderService", ['WorkoutService', function(WorkoutService)
    {
        var service = {};
        var buildingExercise;
        var newExercise;

        // Devuelve el ejercicio para ser manipulado mediante el nombre del mismo, si el ejercicio no existe se creará uno nuevo

        service.startBuilding = function(name)
        {
            if(name)
            {
                buildingExercise = WorkoutService.getExercise(name);
                newExercise = false;
            }
            else
            {
                buildingExercise = new Exercise({});
                newExercise = true;
            }

            return buildingExercise;
        };

        service.save = function()
        {
            var exercise;

            if(newExercise)
            {
                exercise = WorkoutService.addExercise(buildingExercise);
            }
            else
            {
                exercise = WorkoutService.updateExercise(buildingExercise);
            }

            newExercise = false;

            return exercise;
        };

        return service;
    }]);