angular.module('workoutrunner')
    .factory('workoutHistoryTracker', ['$rootScope', 'localStorageService', function($rootScope, localStorageService)
    {
        var maxHistoryItems = 20; // mantiene el registro de los últimos 20 ejercicios

        var storageKey = 'workouthistory';
        var workoutHistory = localStorageService.get(storageKey) || [];

        var currentWorkoutLog = null;
        var service = {};

        service.startTracking = function()
        {
            currentWorkoutLog =
            {
                startedOn: new Date().toISOString(),
                completed: false,
                exercisesDone: 0
            };

            if(workoutHistory.length <= maxHistoryItems)
            {
                workoutHistory.shift();
            }

            workoutHistory.push(currentWorkoutLog);

            localStorageService.add(storageKey, workoutHistory); // se añade el trakeo actual a la memoria del navegador
        };

        service.endTracking = function(completed)
        {
            currentWorkoutLog.completed = completed;
            currentWorkoutLog.endedOn = new Date().toISOString();
            currentWorkoutLog = null;

            localStorageService.add(storageKey, workoutHistory); // se añade el trakeo actual a la memoria del navegador
        };

        service.getHistory = function()
        {
            return workoutHistory;
        };

        // captura del evento que se lanza cuando se ha llamado al servicio $route para cambiar de ruta con éxito

        $rootScope.$on('$routeChangeSuccess', function(e, args)
        {
            if(currentWorkoutLog)
            {
                service.endTracking(false); // termina la rutina actual si se sale de ella, indicando que está incompleta
            }
        });

        $rootScope.$on('event:workoutrunner:exerciseStarted', function(e, exerciseDetail)
        {
            currentWorkoutLog.lastExercise = exerciseDetail.title;
            ++currentWorkoutLog.exercisesDone;

            localStorageService.add(storageKey, workoutHistory); // se añade el trakeo actual a la memoria del navegador
        });

        return service;
    }]);