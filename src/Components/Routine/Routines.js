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
            let ar;

            if (currentDoc.data()?.taskProgress != undefined) {
                ar = currentDoc.data().taskProgress;
                if (ar != undefined) {
                    const found = ar.find(element => element.id === taskID);
                    if (found) {
                        found.amount = amountCompleted;
                        found.completed = amountCompleted === taskRequirementAmount;
                    } else {
                        ar.push({
                            "id": taskID,
                            "amount": amountCompleted,
                            "completed": amountCompleted === taskRequirementAmount ? true : false
                        });
                    }

                } else {
                    ar = [];
                    ar.push({
                        "id": taskID,
                        "amount": amountCompleted,
                        "completed": amountCompleted === taskRequirementAmount ? true : false
                    });
                }
            }

            const tasksBeenCompleted = ar?.filter(element => element.completed === true)?.length === routineTaskAmount;
            console.log(ar)

            if (tasksBeenCompleted)
                setRoutinesCompletedToday(routinesCompletedToday + 1);
            setDoc(routineRef, {
                routineID: routineID,
                taskProgress: currentDoc.data() === undefined ? [{
                    "id": taskID,
                    "amount": amountCompleted,
                    "completed": amountCompleted === taskRequirementAmount ? true : false
                }] : ar,
                completed: tasksBeenCompleted ? true : false,
                userID: user.uid,
                year: dateTodayLong.getFullYear(),
                month: dateTodayLong.getMonth()+1,
                date: getTodaysDate()
            }, {merge: true})

            if(tasksBeenCompleted){
                const routineStreakRef = doc(db, "routineStreak", routineID);
                let streak = 1;

                // get the next day for the task
                const routineFound = routines.find(element => element.id === routineID);

                const todayAsDayOfWeek = dateTodayLong.getDay() === 0 ? 7 : dateTodayLong.getDay();

                let nextDayOfTheWeek = -1;
                for(let i = 0; i < routineFound.days.length; i++){
                    if(todayAsDayOfWeek === routineFound.days[i]){
                        if(i === routineFound.days.length - 1){
                            nextDayOfTheWeek = routineFound.days[0];
                            break;
                        }

                        nextDayOfTheWeek = routineFound.days[i];
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

                let monthOfNextDay = dateTodayLong.getMonth();
                let dayOfNextDay = dateOfNextDay;

                if(dayOfNextDay > totalDaysForThisMonth){
                    dayOfNextDay = totalDaysForThisMonth - dateOfNextDay;
                    monthOfNextDay++;
                }

                console.log("the day: "+ dayOfNextDay + " the month: "+ monthOfNextDay)


                // today day Mon Tue etc.
                // calculate how many days till the next day
                // calculate the date 28 + 4
                // the month might change
                

                // setDoc(routineStreakRef, {
                //     routineID : routineID,
                //     streak: streak,
                //     nextDay:
                // }, {merge: true})
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

    useEffect(() => {
        if (user.uid === undefined)
            return;

        const routinesQuery = query(collection(db, "routine"), where("userID", "==", user.uid), orderBy("created", "desc"));
        onSnapshot(routinesQuery, (querySnapshot) => {
            let activeTodayAmount = 0;
            let completedRoutinesTodayAmount = 0;
            fetchCompletionToday().then((routineProgresses) => {

                // counts how many routines completed
                routineProgresses.forEach((routine) => {
                    if (routine.data().completed) {
                        completedRoutinesTodayAmount++;
                    }
                });

                let gooten = querySnapshot.docs.map((doc) => {
                    let routineProgression;

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
                            ...doc.data(),
                            "activeToday": activeToday,
                            "routineProgression": routineProgression,
                        },
                    }
                })

                setRoutines(gooten);
                setRoutinesActiveToday(activeTodayAmount);
                setRoutinesCompletedToday(completedRoutinesTodayAmount);
            }).catch(() => alert("shit"));
        });
    }, [user]);


    const fetchCompletionToday = async () => {
        const dateTodayLong = new Date();
        const dateToday = dateTodayLong.getDate() + "/" + dateTodayLong.getMonth() + "/" + dateTodayLong.getFullYear()
        const completedRoutinesTodayQuery = query(collection(db, "routineCompletion"), where("userID", "==", user.uid), where("date", "==", dateToday));
        return await getDocs(completedRoutinesTodayQuery);
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