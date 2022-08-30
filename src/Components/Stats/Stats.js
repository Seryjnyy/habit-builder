import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useAuth} from "../Auth/UserAuthContext";
import {db} from "../../firebase";
import {Box, Grid, Typography} from "@mui/material";

function Stats() {
    const {user} = useAuth();
    const [routineCompletion, setRoutineCompletion] = useState([]);
    const [routinesCompleted, setRoutinesCompleted] = useState(0);

    const [tasksAttempted, setTasksAttempted] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);

    const [mostAttemptedRoutine, setMostAttemptedRoutine] = useState({});
    const [mostAttemptedTask, setMostAttemptedTask] = useState({});

    const [mostCompletedRoutine, setMostCompletedRoutine] = useState({});
    const [mostCompletedTask, setMostCompletedTask] = useState({});


    useEffect(() => {
        if(user?.uid === undefined)
            return;

        const date = new Date();
        const q = query(collection(db, "routineCompletion"), where("userID", "==", user.uid), where("year", "==", date.getFullYear()), where("month", "==", date.getMonth() + 1));
        onSnapshot(q, (querySnapshot) => {
            let rCompleted = 0;
            let tAttempted = 0;
            let tCompleted = 0;

            let rAttemptsMap = new Map();
            let tAttemptsMap = new Map();

            let rCompletedMap = new Map();
            let tCompletedMap = new Map();

            setRoutineCompletion(querySnapshot.docs.map(doc => {
                const docData = doc.data();

                if(docData?.completed){
                    rCompleted++;

                    let mapValue = rCompletedMap.get(docData.routineID);
                    rCompletedMap.set(docData.routineID, (mapValue === undefined ? 0 : mapValue) + 1)
                }

                docData?.taskProgress?.forEach(task => {
                    tAttempted++;

                    let mapValue = tAttemptsMap.get(task.id);
                    tAttemptsMap.set(task.id, (mapValue === undefined ? 0 : mapValue) + 1)

                    if(task.completed){
                        tCompleted++;

                        let mapValue = tCompletedMap.get(task.id);
                        tCompletedMap.set(task.id, (mapValue === undefined ? 0 : mapValue) + 1)
                    }
                })

                let mapValue = rAttemptsMap.get(docData.routineID);
                rAttemptsMap.set(docData.routineID, (mapValue === undefined ? 0 : mapValue) + 1)

                return {
                    id: doc.id,
                    data: docData
                }
            }))


            const rAttemptResult = findBiggestValueInMap(rAttemptsMap);
            const tAttemptResult = findBiggestValueInMap(tAttemptsMap);

            setMostAttemptedRoutine({"id" : rAttemptResult.key, "value" : rAttemptResult.value});
            setMostAttemptedTask({"id" : tAttemptResult.key, "value" : tAttemptResult.value});

            const rCompletedResult = findBiggestValueInMap(rCompletedMap);
            const tCompletedResult = findBiggestValueInMap(tCompletedMap);

            setMostCompletedRoutine({"id" : rCompletedResult.key, "value" : rCompletedResult.value})
            setMostCompletedTask({"id" : tCompletedResult.key, "value" : tCompletedResult.value})

            setRoutinesCompleted(rCompleted);

            setTasksAttempted(tAttempted);
            setTasksCompleted(tCompleted);
        })

    }, [user]);

    const findBiggestValueInMap = (map) => {
        let largestValue = 0;
        let largestValueKey;

        map.forEach((value, key) => {
            if(value > largestValue){
                largestValue = value;
                largestValueKey = key;
            }
        })

        return {"key" : largestValueKey, "value": largestValue}
    }


    return (
        <Grid container direction={"column"} alignItems={"center"}>
            <Box sx={{ml: 25}}>
                <Box>
                    <Typography>Routines: </Typography>
                    <Box sx={{ml: 2}}>
                        <Typography>attempted this month: {routineCompletion.length}</Typography>
                        <Typography>completed this month: {routinesCompleted}</Typography>
                        {mostAttemptedRoutine &&  <Typography>most attempted routine: {mostAttemptedRoutine?.id} at: {mostAttemptedRoutine?.value}</Typography>}
                        {mostCompletedRoutine &&  <Typography>most completed routine: {mostCompletedRoutine?.id} at: {mostCompletedRoutine?.value}</Typography>}
                    </Box>
                </Box>

                <Box>
                    <Typography>Tasks: </Typography>
                    <Box sx={{ml: 2}}>
                        <Typography>attempted this month: {tasksAttempted}</Typography>
                        <Typography>completed this month: {tasksCompleted}</Typography>
                        {mostAttemptedTask &&  <Typography>most attempted task: {mostAttemptedTask?.id} at: {mostAttemptedTask?.value}</Typography>}
                        {mostCompletedTask &&  <Typography>most completed task: {mostCompletedTask?.id} at: {mostCompletedTask?.value}</Typography>}
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
}

export default Stats;