import React, {useEffect, useState} from 'react';
import {useAuth} from "../Auth/UserAuthContext";
import {Box, Button, Container, Grid, IconButton, Snackbar, Typography} from "@mui/material";
import Routine from "./Routine";
import CreateRoutineModal from "./CreateRoutineModal";
import CloseIcon from '@mui/icons-material/Close';
import {fetchRoutineCompletion} from "../../Services/fetchRoutineCompletion";
import {fetchRoutineCompletionWithRef} from "../../Services/fetchRoutineCompletionWithRef";
import {setRoutineCompletion} from "../../Services/setRoutineCompletion";
import {fetchRoutineStreak} from "../../Services/fetchRoutineStreak";
import {setRoutineStreak} from "../../Services/setRoutineStreak";
import {fetchTasks} from "../../Services/fetchTasks";
import {fetchRoutinesSnapshot} from "../../Services/fetchRoutinesSnapshot";

function Routines(){
    const {user} = useAuth();

    const [routines, setRoutines] = useState([]);

    const [routinesActiveToday, setRoutinesActiveToday] = useState(0);

    const [routinesCompletedToday, setRoutinesCompletedToday] = useState(0);

    // snackbar things
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
    }
    const snackbarAction = (
        <>
            {/*<Button size={"small"} onClick={handleCloseSnackbar}>reload it</Button>*/}
            <IconButton
                size={"small"}
                onClick={handleCloseSnackbar}
            >
                <CloseIcon fontSize={"small"}></CloseIcon>
            </IconButton>
        </>
    )

    const updateRoutineCompletion = (routineID, taskID, amountCompleted, taskRequirementAmount, routineTaskAmount) => {
        fetchRoutineCompletionWithRef(routineID, new Date()).then((currentDoc) => {

            let taskProgressions = currentDoc.data()?.taskProgress;

            if(taskProgressions === undefined)
                taskProgressions = [];

            let taskProgress = taskProgressions.find(element => element.id === taskID);

            if(taskProgress === undefined){
                taskProgressions.push({
                    "id": taskID,
                    "amount": amountCompleted,
                    "completed": amountCompleted === taskRequirementAmount ? true : false
                });
            }else{
                taskProgress.amount = amountCompleted;
                taskProgress.completed = amountCompleted === taskRequirementAmount;
            }

            const allRoutineTasksCompleted = taskProgressions.filter(element => element.completed === true)?.length === routineTaskAmount;

            if(allRoutineTasksCompleted)
                setRoutinesCompletedToday(routinesCompletedToday + 1);


            let snackbarMessageForRoutineUpdate = (amountCompleted === taskRequirementAmount) ? "Task completed." : "Saved progress.";
            snackbarMessageForRoutineUpdate = allRoutineTasksCompleted ? "Task and routine completed." : snackbarMessageForRoutineUpdate;
            // snackbarMessageForRoutineUpdate = (routinesCompletedToday + 1 > routinesActiveToday) ? "All routines complete!" : snackbarMessageForRoutineUpdate;


            setRoutineCompletion(routineID, new Date(), {
                routineID: routineID,
                taskProgress: taskProgressions,
                completed: allRoutineTasksCompleted,
                userID: user.uid,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                date: getDateDDMMYYYY(new Date())
            }).then(() => {
                setSnackbarMessage(snackbarMessageForRoutineUpdate)
                if(allRoutineTasksCompleted){
                    updateRoutineStreak(routineID);
                }
            }).catch(e => setSnackbarMessage(e.message));

        }).catch(err => alert(err));


    };

    const augh = (routineID, dateTodayLong) => {
        // get the next day for the task
        const routineFound = routines.find(element => element.id === routineID);

        const todayAsDayOfWeek = dateTodayLong.getDay() === 0 ? 7 : dateTodayLong.getDay();

        let nextDayOfTheWeek = -1;
        let routineDays = [...routineFound.data.days].sort();


        for(let i = 0; i < routineDays.length; i++){
            // console.log(routineDays[i])
            if(todayAsDayOfWeek === routineDays[i]){
                if(i === routineDays.length - 1){
                    nextDayOfTheWeek = routineDays[0];
                    break;
                }

                nextDayOfTheWeek = routineDays[i + 1];
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

    const updateRoutineStreak = (routineID) => {
        let newDate = augh(routineID, new Date());

        fetchRoutineStreak(routineID).then((streakDoc) => {
            let streak = 1;

            let longestStreak = 0;
            let longestStreakStartDate = "";
            let longestStreakEndDate = "";
            let streakStartDate = "";

            if(streakDoc.data() != undefined){
                let streakDocData = streakDoc.data();

                streakStartDate  = streakDocData.streakStartDate;
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
    }

    const completeRoutine = async (routineID, tasks) => {
        // // duplicate code with updating routine completion
        // const dateTodayLong = new Date();
        // const customID = "" + routineID + "" + dateTodayLong.getDate() + "" + dateTodayLong.getMonth() + "" + dateTodayLong.getFullYear();
        //
        // const routineRef = doc(db, "routineCompletion", customID);
        //
        // setDoc(routineRef, {
        //     routineID: routineID,
        //     taskProgress: tasks.map((task) => ({
        //         "id": task.id,
        //         "completed": true,
        //         "amount": task.requirementAmount
        //     })),
        //     completed: true,
        //     userID: user.uid,
        //     year: dateTodayLong.getFullYear(),
        //     month: dateTodayLong.getMonth() + 1,
        //     date: getDateDDMMYYYY(new Date())
        // });
    };

    const getDateDDMMYYYY = (date) => {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    };

    useEffect(() => {
        if(user.uid === undefined)
            return;

        fetchRoutinesSnapshot(user.uid, (querySnapshot) => {
            let activeTodayAmount = 0;
            let completedRoutinesTodayAmount = 0;
            // this is so scuffed bro fs
            fetchRoutineCompletion(user.uid, getDateDDMMYYYY(new Date())).then((routineProgresses) => {
                fetchTasks(user.uid).then((taskInfo) => {
                    let taskMap = new Map();
                    taskInfo.docs.map((doc) => {
                        if(!taskMap.has(doc.id))
                            taskMap.set(doc.id, doc.data());
                    });

                    // counts how many routines completed
                    routineProgresses.forEach((routine) => {
                        if(routine.data().completed){
                            completedRoutinesTodayAmount++;
                        }
                    });

                    // loop through routines
                    let gooten = querySnapshot.docs.map((doc) => {
                        let routineProgression;


                        let extendedTasks = doc.data().tasks.map((t) => {
                            return {...t, "taskInfo": taskMap.get(t.id)};
                        });


                        routineProgresses.forEach((routineProgress) => {

                            if(routineProgress.data().routineID == doc.id){
                                routineProgression = routineProgress.data();
                            }
                        });

                        let activeToday = false;

                        doc.data().days.map((day) => {
                            let today = new Date().getDay();
                            today = today === 0 ? 7 : today;

                            if(day === today && !activeToday){
                                activeTodayAmount++;

                                activeToday = true;
                            }
                        });

                        return {
                            id: doc.id,
                            data: {
                                "created": doc.data().created,
                                "days": doc.data().days,
                                "description": doc.data().description,
                                "name": doc.data().name,
                                "userID": doc.data().userID,
                                "tasks": extendedTasks,
                                "activeToday": activeToday,
                                "routineProgression": routineProgression
                            }
                        };
                    });

                    setRoutines(orderRoutines(gooten));
                    setRoutinesActiveToday(activeTodayAmount);
                    setRoutinesCompletedToday(completedRoutinesTodayAmount);
                });
            }).catch(() => alert("shit"));
        });
    }, [user]);


    const orderRoutines = (array) => {
        const active = array.filter(element => element.data.activeToday);
        const notActive = array.filter(element => !element.data.activeToday);

        const completed = active.filter(element => element.data?.routineProgression?.completed === true);
        const notCompleteAndNotStarted = active.filter(element => (element.data?.routineProgression === undefined || element.data?.routineProgression?.completed === false));

        const started = notCompleteAndNotStarted.filter(element => element.data?.routineProgression != undefined);
        const notStarted = notCompleteAndNotStarted.filter(element => element.data?.routineProgression === undefined);

        return [...started, ...notStarted, ...completed, ...notActive]
    }

    return (
        <>
            <Grid container direction={"column"} alignItems={"center"}>
                <Box sx={{mb: 2}}>
                    <Typography>Total routines: {routines.length}</Typography>
                    <Typography>Active today: {routinesActiveToday}</Typography>
                    <Typography>Routines left for today: {routinesActiveToday - routinesCompletedToday}</Typography>
                    <CreateRoutineModal></CreateRoutineModal>
                </Box>


                {/*    this should happen when loading it in, cause we don't want to sort each re-render, which will happen a few times
                 because of other unrelated stuff
                 */}
                {routines.map((routine) => (
                    <Routine key={routine.id} 
                             id={routine.id} 
                             name={routine.data.name}
                             description={routine.data.description} 
                             tasks={routine.data.tasks}
                             activeToday={routine.data.activeToday} 
                             days={routine.data.days}
                             routineProgression={routine.data.routineProgression}
                             updateRoutineCompletion={updateRoutineCompletion}
                             completeRoutine={completeRoutine}>
                    </Routine>
                ))}
            </Grid>
            <Snackbar
                open={snackbarMessage != ""}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                action={snackbarAction}
            >
            </Snackbar>
        </>
    );


}

export default Routines;