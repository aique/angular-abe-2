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
}