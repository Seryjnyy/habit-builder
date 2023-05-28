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
import {updateRoutineStreak} from "../newStuff/updateRoutineStreak"
import {getDateDDMMYYYY} from "../newStuff/dateUtility"
import {orderRoutines} from "../newStuff/orderRoutines"

function Routines(){
    const {user} = useAuth();
    const [routines, setRoutines] = useState([]);
    const [routinesActiveToday, setRoutinesActiveToday] = useState(0);
    const [routinesCompletedToday, setRoutinesCompletedToday] = useState(0);
    const [showAllRoutines, setShowAllRoutines] = useState(false);
    // tags stuff
    const [availableTags, setAvailableTags] = useState([])

    // snackbar things
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
    };
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
    );

    const updateRoutineCompletion = (routineID, taskID, amountCompleted, taskRequirementAmount, routineTaskAmount) => {
        fetchRoutineCompletionWithRef(routineID, new Date()).then((currentDoc) => {
            // get progression for routine
            let taskProgressions = currentDoc.data()?.taskProgress;
            if(taskProgressions === undefined)
                taskProgressions = [];

            // get progression for task from routine progression
            let taskProgress = taskProgressions.find(element => element.id === taskID);

            // add or update task progression
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

            // find out if routine complete
            const allRoutineTasksCompleted = taskProgressions.filter(element => element.completed === true)?.length === routineTaskAmount;
            if(allRoutineTasksCompleted)
                setRoutinesCompletedToday(routinesCompletedToday + 1);


            setRoutineCompletion(routineID, new Date(), {
                routineID: routineID,
                taskProgress: taskProgressions,
                completed: allRoutineTasksCompleted,
                userID: user.uid,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                date: getDateDDMMYYYY(new Date())
            }).then(() => {
                if(allRoutineTasksCompleted){
                    updateRoutineStreak(routineID);
                }

                // set snackbar message
                let snackbarMessageForRoutineUpdate = (amountCompleted === taskRequirementAmount) ? "Task completed." : "Saved progress.";
                snackbarMessageForRoutineUpdate = allRoutineTasksCompleted ? "Task and routine completed." : snackbarMessageForRoutineUpdate;
                // snackbarMessageForRoutineUpdate = (routinesCompletedToday + 1 > routinesActiveToday) ? "All routines complete!" : snackbarMessageForRoutineUpdate;
                setSnackbarMessage(snackbarMessageForRoutineUpdate);
            }).catch(e => setSnackbarMessage(e.message));

        }).catch(err => alert(err));
    };


    useEffect(() => {
        if(user.uid === undefined)
            return;

        fetchRoutinesSnapshot(user.uid, (querySnapshot) => {
            let activeTodayAmount = 0;
            let completedRoutinesTodayAmount = 0;

            // Find all the tags used in all routines
            let tagSet = new Set();
            querySnapshot.docs.forEach(doc => {
                doc.data().tags.forEach(tag => {
                    tagSet.add(tag);
                })
                console.log(doc.data().tags)
            })

            setAvailableTags(Array.from(tagSet));

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
                                "allTasks": taskInfo.docs.map(x => ({
                                    "id": x.id,
                                    "data": x.data()
                                })),
                                "activeToday": activeToday,
                                "routineProgression": routineProgression,
                                "tags": doc.data().tags
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


    return (
        <>
            <Grid container direction={"column"} alignItems={"center"}>
                <Box sx={{mb: 2}}>
                    <Typography>Total routines: {routines.length}</Typography>
                    <Typography>Active today: {routinesActiveToday}</Typography>
                    <Typography>Routines left for today: {routinesActiveToday - routinesCompletedToday}</Typography>
                    <CreateRoutineModal availableTags={availableTags}></CreateRoutineModal>
                </Box>


                {/*    this should happen when loading it in, cause we don't want to sort each re-render, which will happen a few times
                 because of other unrelated stuff
                 */}
                {routines.filter(element => element.data.activeToday).map((routine) => (
                    <Routine key={routine.id}
                             id={routine.id}
                             name={routine.data.name}
                             description={routine.data.description}
                             tasks={routine.data.tasks}
                             activeToday={routine.data.activeToday}
                             days={routine.data.days}
                             allTasks={routine.data.allTasks}
                             routineProgression={routine.data.routineProgression}
                             updateRoutineCompletion={updateRoutineCompletion}
                             tags={routine.data.tags}
                             >
                    </Routine>
                ))}
                <Button onClick={() => setShowAllRoutines(!showAllRoutines)}>Show all routines</Button>
                {showAllRoutines && routines.filter(element => !element.data.activeToday).map((routine) => (
                    <Routine key={routine.id}
                             id={routine.id}
                             name={routine.data.name}
                             description={routine.data.description}
                             tasks={routine.data.tasks}
                             activeToday={routine.data.activeToday}
                             days={routine.data.days}
                             routineProgression={routine.data.routineProgression}
                             updateRoutineCompletion={updateRoutineCompletion}
                             tags={routine.data.tags}
                             >
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