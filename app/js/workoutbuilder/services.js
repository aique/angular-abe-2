angular.module('app').value("appEvents",
{
    workout: {exerciseStarted: "event:workout:exerciseStarted"}
});

angular.module('workoutbuilder')
    .factory("WorkoutBuilderService", ['WorkoutService', function (WorkoutService)
{
        var service = {};
        var buildingWorkout;
        var newWorkout;

        // Devuelve la rutina para ser manipulada mediante el nombre de la misma.
        // Si existe esa será la rutina devuelta, en caso contrario se creará una nueva.

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
        }

        return service;
    }]);