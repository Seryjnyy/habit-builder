export const orderRoutines = (array) => {
    const active = array.filter(element => element.data.activeToday);
    const notActive = array.filter(element => !element.data.activeToday);

    const completed = active.filter(element => element.data?.routineProgression?.completed === true);
    const notCompleteAndNotStarted = active.filter(element => (element.data?.routineProgression === undefined || element.data?.routineProgression?.completed === false));

    const started = notCompleteAndNotStarted.filter(element => element.data?.routineProgression != undefined);
    const notStarted = notCompleteAndNotStarted.filter(element => element.data?.routineProgression === undefined);

    return [...started, ...notStarted, ...completed, ...notActive];
};