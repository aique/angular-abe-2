
/*

 En este fichero se incluirán las definiciones de los módulos utilizados por la aplicación. El nombre del fichero
 y su ubicación es un convencionalismo.

 */

// Se importa el módulo ngRoute para el enlazado de las vistas parciales

angular.module('app', ['workoutrunner', 'workoutbuilder', 'ngRoute']).
config(function($routeProvider, $sceDelegateProvider)
{
    // Declaración de las rutas del módulo workoutrunner

    $routeProvider.when('/start',
    {
        templateUrl: 'partials/workoutrunner/start.html'
    });

    $routeProvider.when('/workout',
    {
        templateUrl: 'partials/workoutrunner/workout.html',
        controller: 'WorkoutController'
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
        resolve: // mecanismo para pasar datos o servicios al controlador
        {
            selectedWorkout: ['WorkoutBuilderService', '$route', '$location', function(WorkoutBuilderService, $route, $location)
            {
                // Si la rutina no se encuentra se redirige al listado de rutinas desde este punto

                var workout = WorkoutBuilderService.startBuilding($route.current.params.id);

                if(!workout)
                {
                    $location.path('/builder/workouts');
                }

                return workout;
            }]
        }
    });

    $routeProvider.when('/builder/exercises/new', { templateUrl: 'partials/workoutbuilder/exercise.html' });
    $routeProvider.when('/builder/exercises/:id', { templateUrl: 'partials/workoutbuilder/exercise.html' });

    // Declaración de la lista blanca de dominios para poder servir su contenido externo dentro de nuestro HTML

    $sceDelegateProvider.resourceUrlWhitelist(
    [
        'self',
        'http://*.youtube.com/**'
    ]);
});

angular.module('workoutrunner', ['ngSanitize', 'ngAnimate', 'mediaPlayer', 'ui.bootstrap', 'LocalStorageModule']);

angular.module('workoutbuilder', ['ngMessages']);