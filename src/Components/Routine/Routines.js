import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuth} from "../Auth/UserAuthContext";
import {Box, Typography} from "@mui/material";
import Routine from "./Routine";

function Routines() {
    const [routines, setRoutines] = useState([]);
    const [routinesCompleted, setRoutinesCompleted] = useState([]);
    const [routinesCompletedAmount, setRoutinesCompletedAmount] = useState(0);
    const [routinesLeftToday, setRoutinesLeftToday] = useState(0);
    const {user} = useAuth();

    const completeRoutine = (routineID) => {
        routinesCompleted.push(routineID);
        setRoutinesCompletedAmount(routinesCompleted.length);
    }

    useEffect(() => {
        if(user.uid === undefined)
            return;

        const q = query(collection(db, "routine"), where("userID", "==", user.uid), orderBy("created", "desc"));
        onSnapshot(q, (querySnapshot) => {
            setRoutines(
                querySnapshot.docs.map((doc) => {
                    let activeToday = false;
                    let activeTodayAmount = 0;
                    doc.data().days.map((day) => {
                        let today = new Date().getDay();
                        today = today === 0 ? 7 : today;

                        if(day === today){
                            activeTodayAmount++;
                            activeToday = true;
                        }
                    });

                    setRoutinesLeftToday(activeTodayAmount);

                    return {
                    id: doc.id,
                    data: {...doc.data(), "activeToday" : activeToday},
                }})
            );
        });

    }, [user]);

    return (
        <>
            <Typography>Total routines: {routines.length}</Typography>
            <Typography>Routines left for today: {routinesLeftToday - routinesCompletedAmount}</Typography>

            {routines.map((routine) => (
                <Routine key={routine.id} id={routine.data.id} name={routine.data.name} description={routine.data.description} tasks={routine.data.tasks} activeToday={routine.data.activeToday} days={routine.data.days} completeRoutine={completeRoutine}></Routine>
            ))}
        </>
    );
}

export default Routines;