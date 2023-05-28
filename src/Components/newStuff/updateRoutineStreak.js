import {fetchRoutineStreak} from "../../Services/fetchRoutineStreak";
import {getDateDDMMYYYY} from "./dateUtility"

// TODO : INCOMPLETE
export const updateRoutineStreak = (routineID) =>{
    // let newDate = augh(routineID, new Date());

    fetchRoutineStreak(routineID).then((streakDoc) => {
        let streak = 1;

        let longestStreak = 0;
        let longestStreakStartDate = "";
        let longestStreakEndDate = "";
        let streakStartDate = "";

        if(streakDoc.data() != undefined){
            let streakDocData = streakDoc.data();

            streakStartDate = streakDocData.streakStartDate;
            longestStreak = streakDocData.longestStreak;
            longestStreakStartDate = streakDocData.longestStreakStartDate;
            longestStreakEndDate = streakDocData.longestStreakEndDate;


            let nextSplit = streakDocData.nextDate.split("/");
            let todaySplit = getDateDDMMYYYY(new Date()).split("/");

            streak = streakDocData.streak;


            if((nextSplit[0] === todaySplit[0]) && (nextSplit[1] === todaySplit[1]) && (nextSplit[2] === todaySplit[2])){
                // good shit you carry on the streak
                streak = streak + 1;
                // console.log("they the same")
            }else{
                // check if before or after
                let properNextDate = new Date(nextSplit[2], nextSplit[1] - 1, nextSplit[0]);
                let properTodayDate = new Date(todaySplit[2], todaySplit[1] - 1, todaySplit[0]);

                if(properTodayDate > properNextDate){
                    // shit you missed it bro
                    if(streak > longestStreak){
                        longestStreak = streak;
                        longestStreakStartDate = streakStartDate;
                        longestStreakEndDate = getDateDDMMYYYY(new Date());
                    }

                    streak = 1;
                    // console.log("today is ahead of next day")
                }else{
                    // this here should not happen
                    // console.log("today is before next day")
                }
            }
        }


        // if streak 1
        // set streakStartDate
        // if flopped
        // then check if the streak against longestStreak
        // if longer than longestStreak
        // then save streak, longestStreakEndDate,
        // setRoutineStreak(routineID, {
        //     routineID: routineID,
        //     streak: streak,
        //     nextDate: newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear(),
        //     streakStartDate: streak === 1 ? getDateDDMMYYYY(new Date()) : streakStartDate,
        //     longestStreak: longestStreak,
        //     longestStreakStartDate: longestStreakStartDate,
        //     longestStreakEndDate: longestStreakEndDate
        // });
    }).catch(e => alert(e.message()));
};