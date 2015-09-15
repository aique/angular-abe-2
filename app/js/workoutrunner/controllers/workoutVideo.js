angular.module('workoutrunner').controller('WorkoutVideoController', ['$scope', '$modal',
    function ($scope, $modal)
    {
        $scope.playVideo = function(videoId)
        {
            $scope.pauseWorkout();

            var dailog = $modal.open(
            {
                templateUrl: 'youtube-modal',
                controller: VideoPlayerController,
                scope:$scope.$new(true),
                resolve:
                {
                    video: function()
                    {
                        return '//www.youtube.com/embed/' + videoId;
                    }
                },
                size: 'lg'
            }).result['finally'](function()
            {
                $scope.resumeWorkout();
            });
        };

        var VideoPlayerController = function ($scope, $modalInstance, video)
        {
            $scope.video = video;

            $scope.ok = function ()
            {
                $modalInstance.close();
            };
        };

        // se añade la propiedad $inject con la nomenclatura adecuada para evitar problemas al minimizar
        // el fichero, al igual que se hace en la definición de un controlador, debido a que el controlador
        // se ha tenido que definir mediante una función habitual

        VideoPlayerController['$inject'] = ['$scope', '$modalInstance', 'video'];

        var init = function ()
        {

        };

        init();
    }]);