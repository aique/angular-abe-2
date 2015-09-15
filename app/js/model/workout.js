/**
 * Modela un plan de ejercicios o rutina.
 *
 * @param args
 * @constructor
 */
function Workout(args)
{
    this.exercises = [];
    this.name = args.name; // se utilizará como identificador
    this.title = args.title;
    this.restBetweenExercise = args.restBetweenExercise;

    /**
     * Calcula la duración de la rutina en segundos.
     *
     * @returns {number}
     */
    this.totalWorkoutDuration = function()
    {
        var exercisesDuration = 0;

        var numExercises = this.exercises.length;

        for(var i = 0 ; i < numExercises ; i++)
        {
            var exerciseDuration = this.exercises[i].duration;

            if(exerciseDuration)
            {
                exercisesDuration += exerciseDuration;
            }
        }

        var restDuration = (numExercises - 1) * this.restBetweenExercise;

        return exercisesDuration + restDuration;
    }
}