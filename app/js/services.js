angular.module('app')
    .provider("WorkoutService", function()
    {
        var dbName;

        // una vez que se ha implementado el interceptor, no será necesario pasar la apiKey por configuración

        // var apiKey;

        // this.configure = function(name, key)

        this.configure = function(name)
        {
            dbName = name;
            // apiKey = key;
        };

        this.$get = ['$http', '$q', '$resource', function($http, $q, $resource)
        {
            var service = {};

            // obtención de la información relativa a los ejercicios mediante el servicio $http

            /*

            service.getExercises = function()
            {
                var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/exercises';

                return $http.get(url, {params: {apiKey: apiKey}})
                    .then(function(response)
                    {
                        return response.data.map(function(exercise)
                        {
                            return new Exercise(exercise);
                        });
                    });
            };

            // Busca en la colección de ejercicios aquel que coincida con el nombre recibido como parámetro y devuelve una copia del mismo

            service.getExercise = function(name)
            {
                var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/exercises/' + name

                return $http.get(url, {params: {apiKey: apiKey}})
                    .then(function(response)
                    {
                        return new Exercise(response.data);
                    });
            };

            service.addExercise = function(exercise)
            {
                if(exercise.name)
                {
                    exercises.push(exercise);

                    return exercise;
                }
            };

            service.updateExercise = function(exercise)
            {
                for(var i = 0 ; i < exercises.length ; i++)
                {
                    if(exercises[i].name === exercise.name)
                    {
                        exercises[i] = exercise;

                        break;
                    }
                }

                return exercise;
            };

            */

            // obtención de la información relativa a los ejercicios mediante el servicio $resource

            // service.Exercises = $resource('https://api.mongolab.com/api/1/databases/' + dbName + '/collections/exercises/:id', {apiKey: apiKey}, {update: {method: 'PUT'}});

            service.Exercises = $resource('https://api.mongolab.com/api/1/databases/' + dbName + '/collections/exercises/:id', {}, {update: {method: 'PUT'}});

            service.getWorkouts = function()
            {
                var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/workouts';

                // return $http.get(url, {params: {apiKey: apiKey}})

                return $http.get(url)
                    .then(function(response)
                    {
                        return response.data.map(function(workout)
                        {
                            return new Workout(workout);
                        });
                    });
            };

            // Busca en la colección de rutinas aquella que coincida con el nombre recibido como parámetro y devuelve una copia de la misma

            service.getWorkout = function(name)
            {
                var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/workouts/' + name;

                // esta función espera a que ambas llamadas obtengan respuesta para proseguir la ejecución

                // el array pasado como parámetro debe ser un conjunto de objetos de tipo promise, por eso con el
                // servicio $resource utilizamos la variable $promise para obtener un objeto de este tipo

                // return $q.all([service.Exercises.query().$promise, $http.get(url, {params: {apiKey: apiKey}})])

                return $q.all([service.Exercises.query().$promise, $http.get(url)])
                    .then(function(response)
                    {
                        // dado que los detalles de cada ejercicio no se encuentran en la colección 'rutinas', sólo
                        // una referencia al nombre de cada ejercicio, es necesario realizar otra consulta para obtener
                        // esa información e iterar por el array de ejercicios de la rutina cubriendo detalles de cada uno

                        var allExercises = response[0];
                        var workout = new Workout(response[1].data);

                        angular.forEach(response[1].data.exercises, function(exerciseInWorkout)
                        {
                            exerciseInWorkout.details = allExercises.filter(function(exerciseInCollection)
                            {
                                return exerciseInCollection.name == exerciseInWorkout.name;
                            })[0];
                        });

                        return workout;
                    });
            };

            service.addWorkout = function(workout)
            {
                if(workout.name)
                {
                    var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/workouts';

                    // previo guardado ha de mapearse el objeto recibido de manera acorde a su representación en base de datos

                    var workoutToSave = angular.copy(workout);

                    workoutToSave.exercises = workoutToSave.exercises.map(function(exercise)
                    {
                        return {
                            name: exercise.details.name,
                            duration: exercise.duration
                        }
                    });

                    workoutToSave._id = workoutToSave.name;

                    // return $http.post(url, workoutToSave, {params: {apiKey: apiKey}})

                    return $http.post(url, workoutToSave)
                        .then(function(response)
                        {
                            return workout; // se retorna la propia rutina una vez se ha almacenado
                        });
                }
            };

            // la función actualizar es similar a la de guardado, salvo por la url utilizada y el método $http.put en lugar de $http.post

            service.updateWorkout = function(workout)
            {
                if(workout.name)
                {
                    // primero comprueba si existe la rutina a actualizar en la base de datos, devolverá null en caso contrario

                    var workoutToUpdate = service.getWorkout(workout.name);

                    if(workoutToUpdate)
                    {
                        var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/workouts/' + workout.name;

                        // previo guardado ha de mapearse el objeto recibido de manera acorde a su representación en base de datos

                        var workoutToSave = angular.copy(workout);

                        workoutToSave.exercises = workoutToSave.exercises.map(function(exercise)
                        {
                            return {
                                name: exercise.details.name,
                                duration: exercise.duration
                            }
                        });

                        workoutToSave._id = workoutToSave.name;

                        // return $http.put(url, workoutToSave, {params: {apiKey: apiKey}})

                        return $http.put(url, workoutToSave)
                            .then(function(response)
                            {
                                return workout; // se retorna la propia rutina una vez se ha almacenado
                            });
                    }
                    else
                    {
                        return null;
                    }
                }
            };

            service.deleteWorkout = function(workout)
            {
                if(workout.name)
                {
                    // primero comprueba si existe la rutina a actualizar en la base de datos, devolverá null en caso contrario

                    var workoutToUpdate = service.getWorkout(workout.name);

                    if(workoutToUpdate)
                    {
                        var url = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/workouts/' + workout.name;

                        // return $http.delete(url, {params: {apiKey: apiKey}})

                        return $http.delete(url)
                            .then(function(response)
                            {
                                return true;
                            });
                    }
                    else
                    {
                        return false;
                    }
                }
            };

            return service;
        }];

    });

angular.module('workoutbuilder')
    .provider("ApiKeyAppenderInterceptor", function()
    {
        var apiKey = null;

        this.configure = function(key)
        {
            apiKey = key;
        };

        this.$get = ['$q', function($q)
        {
            return {

                // la petición se intercepta justo antes del momento en el que es lanzada

                'request': function(config)
                {
                    // si la variable apiKey se ha inicializado y se está haciendo una petición al servidor mongolab

                    if(apiKey && config && config.url.toLowerCase().indexOf('https://api.mongolab.com') >= 0)
                    {
                        config.params = config.params || {}; // si la petición dispone de algún parámetro se conserva

                        config.params.apiKey = apiKey;
                    }

                    return config || $q.when(config); // devuelve el objeto config o la resolución de un objeto promise
                }
            };
        }];
    });