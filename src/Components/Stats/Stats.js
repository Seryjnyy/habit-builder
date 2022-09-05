import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useAuth} from "../Auth/UserAuthContext";
import {db} from "../../firebase";
import {Box, Grid, ToggleButton, ToggleButtonGroup, Typography, Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import {fetchRoutinesSnapshot} from "../../Services/fetchRoutinesSnapshot";
import {ExpandMore} from "@mui/icons-material"

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

    const [routines, setRoutines] = useState([]);

    const [routinesInDay, setRoutinesInDay] = useState(new Map());

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


        const dayRoutine = new Map();

        fetchRoutinesSnapshot(user.uid, (querySnapshot) => {
            setRoutines(querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})));

            querySnapshot.docs.forEach((doc) => {
                doc.data().days.forEach(day => {
                    if(dayRoutine.has(day)){
                        dayRoutine.get(day).push({"routineID" : doc.id})
                    }else{
                        dayRoutine.set(day, [{"routineID" : doc.id}])
                    }
                });
            })

            setRoutinesInDay(dayRoutine);
        });

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

    const [days, setDays] = useState(0);

    const setDaysProxy = (day) => {
        if(days === day){
            return;
        }

        setDays(day)
    }

    const displayRoutinesInTheDay = () => {
        if(days === 0)
            return <></>;


        return <>
            {routinesInDay.get(days).map(element => {
                const routineInfo = routines.find((x) => x.id === element.routineID);
                console.log(routineInfo);


                return <Box key={element.routineID} sx={{mb:2}}>
                    <Typography>{routineInfo.data.name}</Typography>
                    <Typography>{routineInfo.data.description}</Typography>
                </Box>;
            })}
        </>;

    }



    const getExpectedDates = (rDays) => {
        if(rDays === [])
            return;
        const dateToday = new Date();
        const todayAsDayOfWeek = dateToday.getDay() === 0 ? 7 : dateToday.getDay();

        const startingDateOfThisMonth = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1).getDay();
        const endingDateOfThisMonth = new Date(dateToday.getFullYear(), dateToday.getMonth()+1, 0).getDate();

        const startingPoints = [];
        const expectedDates = []

        // create array of starting points
        rDays.forEach((routineDay) => {
            // ofset it so we can make sure we get the legit days before adding 7
            startingPoints.push((routineDay - startingDateOfThisMonth) - 7 + 1);
        })


        startingPoints.forEach(date => {
            while(date + 7 <= endingDateOfThisMonth){
                date = date + 7;
                if(date > 0)
                    expectedDates.push(date);
            }
        })

        return expectedDates;

    }

    const getBoxes = (routineID, rDays) =>{
        const dateToday = new Date();

        const boxes = new Array(new Date(dateToday.getFullYear(), dateToday.getMonth()+1, 0).getDate()).fill(0);

        rDays.forEach(element => boxes[element - 1] = 1);
        const aa = routineCompletion.filter(element => element.data.routineID === routineID);
        aa.forEach(element => {
            const dateSplit = element.data.date.split("/");
            if(element.data.completed){
                boxes[dateSplit[0] - 1] = 3;
            }else{
                boxes[dateSplit[0] - 1] = 2;
            }
        })

        // ideally not gray but like a overlay, disabled kind of thing since we haven't gotten there yet
        boxes.forEach((element, index) => {
            if(index > new Date().getDate())
                boxes[index] = 4;
        })

        return boxes.map((element, index) => {
            let colour;
            switch(boxes[index]){
                case 0:
                    colour = "black"
                    break;
                case 1:
                    colour = "red"
                    break;
                case 2:
                    colour = "orange"
                    break;
                case 3:
                    colour = "green"
                    break;
                case 4:
                    colour = "gray"
                    break;
            }

            return <Box key={index} sx={{backgroundColor: colour, width:8, height:8, m:1}}></Box>;
        })
    }

    return (
        <Grid container direction={"column"} alignItems={"center"}>
            <Box sx={{backgroundColor: "lightBlue", mb:4}}>
                <Typography >This month:</Typography>
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

            <Box sx={{backgroundColor:"lightGreen"}}>
                <ToggleButtonGroup sx={{mb: 1}} color={"primary"} value={days}>
                    <ToggleButton onClick={() => setDaysProxy(1)} value={1}>Mon</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(2)} value={2}>Tus</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(3)} value={3}>Wed</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(4)} value={4}>Thu</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(5)} value={5}>Fri</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(6)} value={6}>Sat</ToggleButton>
                    <ToggleButton onClick={() => setDaysProxy(7)} value={7}>Sun</ToggleButton>
                </ToggleButtonGroup>
                {displayRoutinesInTheDay()}
            </Box>

            <Box sx={{backgroundColor:"lightBlue"}}>
                <Typography>Routine specific:</Typography>
                {routines.map((routine) => {

                    return <Accordion
                        key={routine.id}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                        >
                            <Typography>{routine.data.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {routine.data.description}
                            </Typography>
                            {getBoxes(routine.id, getExpectedDates(routine.data.days))}
                        </AccordionDetails>
                    </Accordion>
                })}



            </Box>
        </Grid>
    );
}

export default Stats;