
// Get the next date for the specified routine
export const getNextDayForRoutine = (routine, dateTodayLong) => {
        // get the next day for the task

        // find routine
        //const routine = routines.find(element => element.id === routineID);

        const todayAsDayOfWeek = dateTodayLong.getDay() === 0 ? 7 : dateTodayLong.getDay();

        let nextDayOfTheWeek = -1;
        let routineDays = [...routine.data.days].sort();


        for(let i = 0; i < routineDays.length; i++){
            // If we found today in the routine schedule
            if(todayAsDayOfWeek === routineDays[i]){
                
                // If today is the last day in the routine schedule,
                // then set to the first day in schedule.
                // Else just set to the next day in schedule.
                if(i === routineDays.length - 1){
                    nextDayOfTheWeek = routineDays[0];
                }else{
                    nextDayOfTheWeek = routineDays[i + 1];
                }
                
                break;
            }
        }

        let daysTillNextDay = nextDayOfTheWeek - todayAsDayOfWeek;

        // the same day next week
        if(daysTillNextDay === 0){
            daysTillNextDay = 7;
        }else if(daysTillNextDay < 0){
            // wrap around
            daysTillNextDay = daysTillNextDay + 7;
        }

        const dateOfNextDay = dateTodayLong.getDate() + daysTillNextDay;

        const totalDaysForThisMonth = new Date(dateTodayLong.getFullYear(), dateTodayLong.getMonth(), 0).getDate();

        let dayOfNextDay = dateOfNextDay;

        if(dayOfNextDay > totalDaysForThisMonth){
            dayOfNextDay = Math.abs(totalDaysForThisMonth - dateOfNextDay);
        }

        let someDate = new Date();
        let result = someDate.setDate(someDate.getDate() + daysTillNextDay);
        return new Date(result);
}