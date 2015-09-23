
/*

 En este fichero se incluirán las definiciones de los módulos utilizados por la aplicación. El nombre del fichero
 y su ubicación es un convencionalismo.

 */

// Se importa el módulo ngRoute para el enlazado de las vistas parciales

angular.module('app', ['workoutrunner', 'workoutbuilder', 'ngRoute', 'ngResource']).
config(function($routeProvider, $sceDelegateProvider, $httpProvider, WorkoutServiceProvider, ApiKeyAppenderInterceptorProvider)
{
    // Declaración de las rutas del módulo workoutrunner

    $routeProvider.when('/start',
    {
        templateUrl: 'partials/workoutrunner/start.html',
        controller: 'WorkoutStartController'
    });

    $routeProvider.when('/workout/:id',
    {
        templateUrl: 'partials/workoutrunner/workout.html',
        controller: 'WorkoutController',
        resolve: // mecanismo para pasar datos o servicios al controlador
        {
            selectedWorkout: ['WorkoutService', '$route', '$location', function(WorkoutService, $route, $location)
            {
                // Si la rutina no se encuentra se redirige a la pantalla de inicio de ejecución de rutinas

                var workout = WorkoutService.getWorkout($route.current.params.id);

                if(!workout)
                {
                    $location.path('/start');
                }

                return workout;
            }]
        }
    });

    $routeProvider.when('/finish',
    {
        templateUrl: 'partials/workoutrunner/finish.html'
    });

    $routeProvider.otherwise(
    {
        redirectTo: '/start'
    });

    // Declaración de las rutas del módulo workoutbuilder

    $routeProvider.when('/builder',
    {
        redirectTo: '/builder/workouts'
    });

    $routeProvider.when('/builder/workouts',
    {
        templateUrl: 'partials/workoutbuilder/workouts.html',
        leftNav: 'partials/workoutbuilder/left-nav-main.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'WorkoutListController'
    });

    $routeProvider.when('/builder/exercises',
    {
        templateUrl: 'partials/workoutbuilder/exercises.html',
        leftNav: 'partials/workoutbuilder/left-nav-main.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'ExerciseListController'
    });

    $routeProvider.when('/builder/workouts/new',
    {
        templateUrl: 'partials/workoutbuilder/workout.html',
        leftNav: 'partials/workoutbuilder/left-nav-exercises.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'WorkoutDetailController', // controlador de la ruta
        resolve: // mecanismo para pasar datos o servicios al controlador
        {
            selectedWorkout: ['WorkoutBuilderService', function(WorkoutBuilderService)
            {
                return WorkoutBuilderService.startBuilding();
            }]
        }
    });

    $routeProvider.when('/builder/workouts/:id',
    {
        templateUrl: 'partials/workoutbuilder/workout.html',
        leftNav: 'partials/workoutbuilder/left-nav-exercises.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'WorkoutDetailController', // controlador de la ruta
        routeErrorMessage: 'No se puede cargar la rutina especificada!.', // mensaje de error en caso de que no exista la rutina solicitada
        resolve: // mecanismo para pasar datos o servicios al controlador
        {
            selectedWorkout: ['WorkoutBuilderService', '$route', '$location', function(WorkoutBuilderService, $route, $location)
            {
                // Si la rutina no se encuentra se redirige al listado de rutinas desde este punto

                var workout = WorkoutBuilderService.startBuilding($route.current.params.id);

                // A pesar de que startBuilding devuelve un objeto promise, no es necesario recurrir a la función
                // then ya que $routeProvider espera a que se ejecute el método resolve y asigna la respuesta a la variable

                if(!workout)
                {
                    $location.path('/builder/workouts');
                }

                return workout;
            }]
        }
    });

    $routeProvider.when('/builder/exercises/new',
    {
        templateUrl: 'partials/workoutbuilder/exercise.html',
        leftNav: 'partials/workoutbuilder/left-nav-main.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'ExerciseDetailController',
        resolve:
        {
            selectedExercise: ['ExerciseBuilderService', function(ExerciseBuilderService)
            {
                return ExerciseBuilderService.startBuilding();
            }]
        }
    });

    $routeProvider.when('/builder/exercises/:id',
    {
        templateUrl: 'partials/workoutbuilder/exercise.html',
        leftNav: 'partials/workoutbuilder/left-nav-main.html', // menú lateral de la vista
        topNav: 'partials/workoutbuilder/top-nav.html', // menú superior de la vista
        controller: 'ExerciseDetailController',
        routeErrorMessage: 'No se puede cargar el ejercicio especificado!.', // mensaje de error en caso de que no exista la rutina solicitada
        resolve:
        {
            selectedExercise: ['ExerciseBuilderService', '$route', '$location', function (ExerciseBuilderService, $route, $location)
            {
                // Si el ejercicio no se encuentra se redirige al listado de ejercicios desde este punto

                var exercise = ExerciseBuilderService.startBuilding($route.current.params.id);

                if(!exercise)
                {
                    $location.path('/builder/exercises');
                }

                return exercise;
            }]
        }
    });

    // Declaración de la lista blanca de dominios para poder servir su contenido externo dentro de nuestro HTML

    $sceDelegateProvider.resourceUrlWhitelist(
    [
        'self',
        'http://*.youtube.com/**'
    ]);

    // Inicialización de providers

    // WorkoutServiceProvider.configure(Config.dbname, Config.apiKey);

    WorkoutServiceProvider.configure(Config.dbname);

    ApiKeyAppenderInterceptorProvider.configure(Config.apiKey);

    // Definición de los interceptores HTTP

    $httpProvider.interceptors.push('ApiKeyAppenderInterceptor');
});

angular.module('workoutrunner', ['ngSanitize', 'ngAnimate', 'mediaPlayer', 'ui.bootstrap', 'LocalStorageModule']);

angular.module('workoutbuilder', ['ngMessages']);