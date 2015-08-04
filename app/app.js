
/*

 En este fichero se incluirán las definiciones de los módulos utilizados por la aplicación. El nombre del fichero
 y su ubicación es un convencionalismo.

 */

// Se importa el módulo ngRoute para el enlazado de las vistas parciales

angular.module('7MinutesWorkout', ['ngRoute', 'ngSanitize', 'mediaPlayer']).
config(function($routeProvider, $sceDelegateProvider)
{
    // Declaración de las rutas del módulo

    $routeProvider.when('/start',
    {
        templateUrl: 'app/partials/start.html'
    });

    $routeProvider.when('/workout',
    {
        templateUrl: 'app/partials/workout.html',
        controller: 'WorkoutController'
    });

    $routeProvider.when('/finish',
    {
        templateUrl: 'app/partials/finish.html'
    });

    $routeProvider.otherwise(
    {
        redirectTo: '/start'
    });

    // Declaración de la lista blanca de dominios para poder servir su contenido externo dentro de nuestro HTML

    $sceDelegateProvider.resourceUrlWhitelist(
    [
        'self',
        'http://*.youtube.com/**'
    ]);
});