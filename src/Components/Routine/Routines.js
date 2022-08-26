import React, {useEffect, useState} from 'react';
import {collection, doc, onSnapshot, orderBy, query, updateDoc, getDoc, where, setDoc, getDocs, addDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuth} from "../Auth/UserAuthContext";
import {Box, Typography} from "@mui/material";
import Routine from "./Routine";

function Routines() {
    const {user} = useAuth();

    const [routines, setRoutines] = useState([]);
    const [routineCompletionToday, setRoutineCompletionToday] = useState([]);

    const [routinesActiveToday, setRoutinesActiveToday] = useState(0);
    const [routinesCompletedToday, setRoutinesCompletedToday] = useState(0);

    // useEffect(() => {
    //     setRoutinesLeftToday(routinesActiveToday - routineCompletionToday.length);
    // }, [routineCompletionToday]);


    // update routine completion -- needs changing names

    const updateRoutineCompletion = (routineID, taskCompleted) => {
        const dateTodayLong = new Date();
        const customID = ""+routineID +"" +dateTodayLong.getDate() + "" + dateTodayLong.getMonth() + "" + dateTodayLong.getFullYear();

        const routineRef = doc(db, "routineCompletion", customID);

        getDoc(routineRef).then((currentDoc) => {
            let ar;
            console.log(currentDoc.data()?.taskProgress)

            if(currentDoc.data()?.taskProgress != undefined){
                ar = currentDoc.data().taskProgress;
                ar.push(taskCompleted);
            }

            setDoc(routineRef, {
                routineID : routineID,
                taskProgress: currentDoc.data() === undefined ? [taskCompleted] : ar,
                completed: true,
                date: getTodaysDate()}, {merge: true})


        }).catch(err => alert(err));


    }

    // in format dd/mm/yyyy
    const getTodaysDate = () => {
        const dateTodayLong = new Date();
        return dateTodayLong.getDate() + "/" + dateTodayLong.getMonth() + "/" + dateTodayLong.getFullYear()
    }

    const completeRoutine = async (routineID, tasksCompleted) => {
        // routinesCompletedToday.push(routineID);
        // setRoutinesCompletedAmount(routinesCompletedToday.length);
        const dateToday = getTodaysDate();
        console.log("too man'y calls")
        try{
            const q = query(collection(db, "routineCompletion"), where("routineID", "==", routineID), where("date", "==", dateToday))
            await getDocs(q).then((data) => {

                if(data.empty){
                    addDoc(collection(db, "routineCompletion"), {
                        routineID : routineID,
                        taskProgress: tasksCompleted,
                        completed: true,
                        date: dateToday
                    })
                    setRoutinesCompletedToday(routinesCompletedToday + 1);
                }else{
                    console.log("this should start happening")
                    // updateDoc()
                }
            });





        }catch(err){
            alert(err)
        }
        // add or update a record stating the progress of routine
        // save routine ID, todays date, array of taskIDs completed
    }


    useEffect(() => {
        // console.log(routineCompletionToday)
    }, [routineCompletionToday]);

    useEffect(() => {
        // console.log(routines)
    }, [routines]);


    // need to load in if exists the record for a routine
    // user routineID and todays date
    useEffect(() => {
        if(user.uid === undefined)
            return;




        // onSnapshot(completedRoutinesTodayQuery, (querySnapshot) => {
        //     setRoutineCompletionToday(
        //         querySnapshot.docs.map((doc) => ({
        //         id: doc.id,
        //         data: doc.data()
        //     })));
        // });

        // the routines need to know which tasks are already completed

        // console.log(routineCompletionTodayTemp)
        // fetch routines
        const routinesQuery = query(collection(db, "routine"), where("userID", "==", user.uid), orderBy("created", "desc"));
        onSnapshot(routinesQuery, (querySnapshot) => {
            let activeTodayAmount = 0;
            let completedRoutinesTodayAmount = 0;
                    fetchCompletionToday().then((data) => {
                        // go through completion data once to calculate how many completed
                        data.forEach((routine) => {
                            completedRoutinesTodayAmount++;
                        });
                        console.log("how many times")

                        // go through routines and for each one do
                        // find the tasks already completed for it
                        // find if active today
                            let gooten = querySnapshot.docs.map((doc) => {
                            // fetch routine completion today, get the related data to the tasks
                            let tasksAlreadyCompleted = [];
                            let completeAlready = false;

                            data.forEach((routine) => {
                                if(routine.data().routineID == doc.id){
                                    tasksAlreadyCompleted = routine.data().tasksCompleted;
                                    completeAlready = routine.data().completed;
                                }
                            });


                            if(tasksAlreadyCompleted === undefined || tasksAlreadyCompleted === null)
                                tasksAlreadyCompleted = [];

                            // check if routine is active today
                            let activeToday = false;

                            doc.data().days.map((day) => {
                                let today = new Date().getDay();
                                today = today === 0 ? 7 : today;

                                // only increment once for the routine
                                if(day === today && !activeToday){
                                    activeTodayAmount++;

                                    activeToday = true;
                                }
                            });

                            return {
                                id: doc.id,
                                data: {...doc.data(), "activeToday" : activeToday, "tasksCompletedToday" : tasksAlreadyCompleted, "alreadyComplete" : completeAlready},
                            }
                            })
                        setRoutines(gooten);
                        setRoutinesActiveToday(activeTodayAmount);
                        setRoutinesCompletedToday(completedRoutinesTodayAmount);
                    }).catch(() => alert("shit"));

        });


        // add completed tasks to completed array


    }, [user]);


    const fetchCompletionToday = async () => {
        const dateTodayLong = new Date();
        const dateToday = dateTodayLong.getDate() + "/" + dateTodayLong.getMonth() + "/" + dateTodayLong.getFullYear()
        const completedRoutinesTodayQuery = query(collection(db, "routineCompletion"), where("date", "==", dateToday));
        return await getDocs(completedRoutinesTodayQuery);
    }


    return (
        <>
            <Typography>Total routines: {routines.length}</Typography>
            <Typography>Active today: {routinesActiveToday}</Typography>
            <Typography>Routines left for today: {routinesActiveToday - routinesCompletedToday}</Typography>

            {routines.map((routine) => (
                <Routine key={routine.id} id={routine.id} name={routine.data.name} description={routine.data.description} tasks={routine.data.tasks} activeToday={routine.data.activeToday} days={routine.data.days} tasksCompletedToday={routine.data.tasksCompletedToday} alreadyComplete={routine.data.alreadyComplete} updateRoutineCompletion={updateRoutineCompletion}completeRoutine={completeRoutine}></Routine>
            ))}
        </>
    );
}

export default Routines;