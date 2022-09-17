import React, {useEffect, useMemo, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useAuth} from "../Auth/UserAuthContext";
import {db} from "../../firebase";
import {
    Box,
    Grid,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper, Divider
} from "@mui/material";
import {fetchRoutinesSnapshot} from "../../Services/fetchRoutinesSnapshot";
import {ExpandMore} from "@mui/icons-material";
import RoutineCalendar from "./RoutineCalendar";
import RoutineSpecificAccordion from "./RoutineSpecificAccordion";
import RoutinesInDay from "./RoutinesInDay";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        console.log(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

function Stats(){
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
                    rCompletedMap.set(docData.routineID, (mapValue === undefined ? 0 : mapValue) + 1);
                }

                docData?.taskProgress?.forEach(task => {
                    tAttempted++;

                    let mapValue = tAttemptsMap.get(task.id);
                    tAttemptsMap.set(task.id, (mapValue === undefined ? 0 : mapValue) + 1);

                    if(task.completed){
                        tCompleted++;

                        let mapValue = tCompletedMap.get(task.id);
                        tCompletedMap.set(task.id, (mapValue === undefined ? 0 : mapValue) + 1);
                    }
                });

                let mapValue = rAttemptsMap.get(docData.routineID);
                rAttemptsMap.set(docData.routineID, (mapValue === undefined ? 0 : mapValue) + 1);

                return {
                    id: doc.id,
                    data: docData
                };
            }));


            const rAttemptResult = findBiggestValueInMap(rAttemptsMap);
            const tAttemptResult = findBiggestValueInMap(tAttemptsMap);

            setMostAttemptedRoutine({"id": rAttemptResult.key, "value": rAttemptResult.value});
            setMostAttemptedTask({"id": tAttemptResult.key, "value": tAttemptResult.value});

            const rCompletedResult = findBiggestValueInMap(rCompletedMap);
            const tCompletedResult = findBiggestValueInMap(tCompletedMap);

            setMostCompletedRoutine({"id": rCompletedResult.key, "value": rCompletedResult.value});
            setMostCompletedTask({"id": tCompletedResult.key, "value": tCompletedResult.value});

            setRoutinesCompleted(rCompleted);

            setTasksAttempted(tAttempted);
            setTasksCompleted(tCompleted);
        });


        const dayRoutine = new Map();

        fetchRoutinesSnapshot(user.uid, (querySnapshot) => {
            setRoutines(querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})));

            querySnapshot.docs.forEach((doc) => {
                doc.data().days.forEach(day => {
                    if(dayRoutine.has(day)){
                        dayRoutine.get(day).push({"routineID": doc.id});
                    }else{
                        dayRoutine.set(day, [{"routineID": doc.id}]);
                    }
                });
            });

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
        });

        return {"key": largestValueKey, "value": largestValue};
    };

    return (
        <Grid container direction={"column"} alignItems={"center"}>
                <Paper sx={{mb: 2, p:2}}>
                    <Typography variant={"h5"}>Stats this month</Typography>
                    <Divider sx={{mb:2}}/>
                    <Paper variant={"outlined"} sx={{p:2}}>
                        <Typography>Routines: </Typography>
                        <Box sx={{ml: 2}}>
                            <Typography>attempted this month: {routineCompletion.length}</Typography>
                            <Typography>completed this month: {routinesCompleted}</Typography>
                            {mostAttemptedRoutine && <Typography>most attempted
                                routine: {mostAttemptedRoutine ? routines.find(routine => routine.id === mostAttemptedRoutine.id)?.data.name : ""} at: {mostAttemptedRoutine?.value}</Typography>}
                            {mostCompletedRoutine && <Typography>most completed
                                routine: {mostCompletedRoutine ? routines.find(routine => routine.id === mostCompletedRoutine.id)?.data.name : ""} at: {mostCompletedRoutine?.value}</Typography>}
                        </Box>
                    </Paper>

                    <Paper variant={"outlined"} sx={{p:2}}>
                        <Typography>Tasks: </Typography>
                        <Box sx={{ml: 2}}>
                            <Typography>attempted this month: {tasksAttempted}</Typography>
                            <Typography>completed this month: {tasksCompleted}</Typography>
                            {mostAttemptedTask && <Typography>most attempted
                                task: {mostAttemptedTask?.id} at: {mostAttemptedTask?.value}</Typography>}
                            {mostCompletedTask && <Typography>most completed
                                task: {mostCompletedTask?.id} at: {mostCompletedTask?.value}</Typography>}
                        </Box>
                    </Paper>
                </Paper>



            <RoutinesInDay routines={routines} routinesInDay={routinesInDay}/>

            <Paper sx={{p:2}}>
                <Typography variant={"h5"}>Routine specific stats</Typography>
                <Divider sx={{mb:2}}/>
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
                            <Paper variant={"outlined"} sx={{p:5}}>
                                <Typography>Calendar:</Typography>
                                <Box sx={{display:"flex", justifyContent:"space-between"}} >
                                    <Typography>Mon</Typography>
                                    <Typography>Tue</Typography>
                                    <Typography>Wed</Typography>
                                    <Typography>Thu</Typography>
                                    <Typography>Fri</Typography>
                                    <Typography>Sat</Typography>
                                    <Typography>Sun</Typography>
                                </Box>
                                <RoutineCalendar routineID={routine.id} routineDays={routine.data.days}
                                                 routineCompletion={routineCompletion} routineCreationDate={routine.data.created}></RoutineCalendar>
                            </Paper>

                        </AccordionDetails>
                    </Accordion>;
                })}


            </Paper>
        </Grid>
    );
}

export default Stats;