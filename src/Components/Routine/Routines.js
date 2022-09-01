import React, {useEffect, useState} from 'react';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    getDoc,
    where,
    setDoc,
    getDocs,
} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuth} from "../Auth/UserAuthContext";
import {Box, Container, Grid, Typography} from "@mui/material";
import Routine from "./Routine";
import CreateRoutineModal from "./CreateRoutineModal";

function Routines() {
    const {user} = useAuth();

    const [routines, setRoutines] = useState([]);

    const [routinesActiveToday, setRoutinesActiveToday] = useState(0);

    const [routinesCompletedToday, setRoutinesCompletedToday] = useState(0);

    const updateRoutineCompletion = (routineID, taskID, amountCompleted, taskRequirementAmount, routineTaskAmount) => {
        const dateTodayLong = new Date();
        const customID = "" + routineID + "" + dateTodayLong.getDate() + "" + dateTodayLong.getMonth() + "" + dateTodayLong.getFullYear();

        const routineRef = doc(db, "routineCompletion", customID);

        getDoc(routineRef).then((currentDoc) => {

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

            if (allRoutineTasksCompleted)
                setRoutinesCompletedToday(routinesCompletedToday + 1);
            
            // this needs error handling
            setDoc(routineRef, {
                routineID: routineID,
                taskProgress: taskProgressions,
                completed: allRoutineTasksCompleted,
                userID: user.uid,
                year: dateTodayLong.getFullYear(),
                month: dateTodayLong.getMonth()+1,
                date: getTodaysDate()
            }, {merge: true})


            if(allRoutineTasksCompleted) {
                const routineStreakRef = doc(db, "routineStreak", routineID);

                // get the next day for the task
                const routineFound = routines.find(element => element.id === routineID);

                const todayAsDayOfWeek = dateTodayLong.getDay() === 0 ? 7 : dateTodayLong.getDay();

                let nextDayOfTheWeek = -1;
                let routineDays = [...routineFound.data.days].sort();


                for (let i = 0; i < routineDays.length; i++) {
                    // console.log(routineDays[i])
                    if (todayAsDayOfWeek === routineDays[i]) {
                        if (i === routineDays.length - 1) {
                            nextDayOfTheWeek = routineDays[0];
                            break;
                        }

                        nextDayOfTheWeek = routineDays[i + 1];
                        break;
                    }
                }

                let daysTillNextDay = nextDayOfTheWeek - todayAsDayOfWeek;

                // the same day next week
                if (daysTillNextDay === 0) {
                    daysTillNextDay = 7;
                } else if (daysTillNextDay < 0) {
                    // wrap around
                    daysTillNextDay = daysTillNextDay + 7;
                }

                const dateOfNextDay = dateTodayLong.getDate() + daysTillNextDay;

                const totalDaysForThisMonth = new Date(dateTodayLong.getFullYear(), dateTodayLong.getMonth(), 0).getDate();

                let dayOfNextDay = dateOfNextDay;

                if (dayOfNextDay > totalDaysForThisMonth) {
                    dayOfNextDay = Math.abs(totalDaysForThisMonth - dateOfNextDay);
                }

                let someDate = new Date();
                let result = someDate.setDate(someDate.getDate() + daysTillNextDay);
                let newDate = new Date(result)

                getDoc(routineStreakRef).then((streakDoc) => {
                    let streak = 1;

                    if(streakDoc.data() != undefined){
                        let streakDocData = streakDoc.data();

                        let nextSplit = streakDocData.nextDate.split("/")
                        let todaySplit = getDateDDMMYYYY(new Date()).split("/")

                        streak = streakDocData.streak;

                        // console.log(nextSplit)
                        // console.log(todaySplit)

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
                                streak = 1;
                                // console.log("today is ahead of next day")
                            }else{
                                // this here should not happen
                                // console.log("today is before next day")
                            }
                        }
                    }


                    setDoc(routineStreakRef, {
                        routineID : routineID,
                        streak: streak,
                        nextDate: newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/"+newDate.getFullYear()
                    }, {merge: true})
                });


                }

            }).catch(err => alert(err));


    }

    const completeRoutine = async (routineID, tasks) => {
        // duplicate code with updating routine completion
        const dateTodayLong = new Date();
        const customID = "" + routineID + "" + dateTodayLong.getDate() + "" + dateTodayLong.getMonth() + "" + dateTodayLong.getFullYear();

        const routineRef = doc(db, "routineCompletion", customID);

        setDoc(routineRef, {
            routineID: routineID,
            taskProgress: tasks.map((task) => ({
                "id": task.id,
                "completed": true,
                "amount": task.requirementAmount,
            })),
            completed: true,
            userID: user.uid,
            year: dateTodayLong.getFullYear(),
            month: dateTodayLong.getMonth()+1,
            date: getTodaysDate()
        })

        // const dateToday = getTodaysDate();
        // console.log("too man'y calls")
        // try {
        //     const q = query(collection(db, "routineCompletion"), where("routineID", "==", routineID), where("date", "==", dateToday))
        //     await getDocs(q).then((data) => {
        //
        //         if (data.empty) {
        //             addDoc(collection(db, "routineCompletion"), {
        //                 routineID: routineID,
        //                 taskProgress: tasksCompleted,
        //                 completed: true,
        //                 date: dateToday
        //             })
        //             setRoutinesCompletedToday(routinesCompletedToday + 1);
        //         } else {
        //             console.log("this should start happening")
        //             // updateDoc()
        //         }
        //     });
        // } catch (err) {
        //     alert(err)
        // }
    }

    const getTodaysDate = () => {
        // in format dd/mm/yyyy
        const dateTodayLong = new Date();
        return dateTodayLong.getDate() + "/" + dateTodayLong.getMonth() + "/" + dateTodayLong.getFullYear()
    }

    const getDateDDMMYYYY = (date) => {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    }

    useEffect(() => {
        if (user.uid === undefined)
            return;

        const routinesQuery = query(collection(db, "routine"), where("userID", "==", user.uid), orderBy("created", "desc"));
        onSnapshot(routinesQuery, (querySnapshot) => {
            let activeTodayAmount = 0;
            let completedRoutinesTodayAmount = 0;
            // this is so scuffed bro fs
            fetchCompletionToday().then((routineProgresses) => {
                fetchTaskInfo().then((taskInfo) => {
                    let taskMap = new Map();
                    taskInfo.docs.map((doc) => {
                        if(!taskMap.has(doc.id))
                            taskMap.set(doc.id, doc.data());
                    })

                    // counts how many routines completed
                    routineProgresses.forEach((routine) => {
                        if (routine.data().completed) {
                            completedRoutinesTodayAmount++;
                        }
                    });

                    // loop through routines
                    let gooten = querySnapshot.docs.map((doc) => {
                        let routineProgression;



                        let extendedTasks = doc.data().tasks.map((t) => {
                            return {...t, "taskInfo" : taskMap.get(t.id)}
                        })


                        routineProgresses.forEach((routineProgress) => {

                            if (routineProgress.data().routineID == doc.id) {
                                routineProgression = routineProgress.data();
                            }
                        })

                        let activeToday = false;

                        doc.data().days.map((day) => {
                            let today = new Date().getDay();
                            today = today === 0 ? 7 : today;

                            if (day === today && !activeToday) {
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
                                "tasks" : extendedTasks,
                                "activeToday": activeToday,
                                "routineProgression": routineProgression,
                            }
                        }
                    })

                    setRoutines(gooten);
                    setRoutinesActiveToday(activeTodayAmount);
                    setRoutinesCompletedToday(completedRoutinesTodayAmount);
                })
            }).catch(() => alert("shit"));
        });


        // fetch taskInfo
        // go through each and add to map
        // store map in state
        // then when passing props to Task use get() on map
    }, [user]);

    const fetchCompletionToday = async () => {
        const dateTodayLong = new Date();
        const dateToday = dateTodayLong.getDate() + "/" + dateTodayLong.getMonth() + "/" + dateTodayLong.getFullYear()
        const completedRoutinesTodayQuery = query(collection(db, "routineCompletion"), where("userID", "==", user.uid), where("date", "==", dateToday));
        return await getDocs(completedRoutinesTodayQuery);
    }

    const fetchTaskInfo = async () => {
        const q = query(collection(db, "tasks"), where("userID", "==", user.uid));
        return await getDocs(q);
    }

    const comperator = (a, b) => {
        let aa = a.data?.routineProgression?.completed;
        let bb = b.data?.routineProgression?.completed;

        if (aa === bb) {
            return 0;
        } else if (aa === true && bb === false) {
            return 1;
        } else if (aa === false && bb === true) {
            return -1;
        } else if ((aa === undefined && a.data?.activeToday) && bb === true) {
            return -1;
        } else if (aa === true && (bb === undefined && b.data?.activeToday)) {
            return 1;
        } else if ((aa === undefined && a.data?.activeToday) && bb === false) {
            return 1;
        } else if (aa === false && (bb === undefined && b.data?.activeToday)) {
            return -1;
        } else if (aa === undefined && bb === true) {
            return 1;
        } else if (aa === true && bb === undefined) {
            return -1;
        } else if (aa === undefined && bb === false) {
            return 1;
        } else if (aa === false && bb === undefined) {
            return -1;
        }

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
            {routines.sort((a, b) => comperator(a, b)).map((routine) => (
                <Routine key={routine.id} id={routine.id} name={routine.data.name}
                         description={routine.data.description} tasks={routine.data.tasks}
                         activeToday={routine.data.activeToday} days={routine.data.days}
                         routineProgression={routine.data.routineProgression}
                         updateRoutineCompletion={updateRoutineCompletion} completeRoutine={completeRoutine}></Routine>
            ))}
            </Grid>
        </>
    );


}

export default Routines;