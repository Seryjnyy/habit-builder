import React, {useEffect, useState} from 'react';
import {Box, LinearProgress, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import TaskToComplete from "./TaskToComplete";

function Routine({id, name, description, days, activeToday, tasks, routineProgression, updateRoutineCompletion, completeRoutine}) {
    const [taskProgress, setTaskProgress] = useState((routineProgression?.taskProgress === undefined ? [] : routineProgression.taskProgress));
    const [completed, setCompleted] = useState(false);

    const completeTask = (taskID) => {
        setTaskProgress([...taskProgress, taskID]);
        // updateRoutineCompletion
    }

    const [routineStatus, setRoutineStatus] = useState("")

    useEffect(() => {
        // console.log("task am    ount " + tasks.length + " finished " + tasksCompletedToday.length)
        if(completed){
            setRoutineStatus("Finished");
        }
        else if(activeToday)
            setRoutineStatus("Active");
        else
            setRoutineStatus("Not today");

    }, [completed]);

    // needs to check if it has been completed already
    useEffect(() => {
        if(taskProgress.filter(element => (element.completed === true)).length === tasks.length && activeToday && tasks.length > 0 && !completed){
            // completeRoutine(id, taskProgress);
            setCompleted(true);
        }
    }, [taskProgress]);

    const updateRoutineCompletionID = (taskID, amountCompleted, routineTaskAmount) => {
        if(amountCompleted === tasks.find(x => (x.id === taskID))?.requirementAmount)
            setTaskProgress([...taskProgress, {"completed" : true}])
        updateRoutineCompletion(id, taskID, amountCompleted, routineTaskAmount, tasks.length);
    }

    return (
        <Box sx={{backgroundColor : "#e0f2f1", mb: 2, p: 2, borderRadius: 2}}>
            <Typography>ID: {id}</Typography>
            <Typography>Name: {name}</Typography>
            <Typography>Description: {description}</Typography>
            <ToggleButtonGroup disabled={true} color={"primary"} value={days}>
                <ToggleButton value={1}>Mon</ToggleButton>
                <ToggleButton value={2}>Tus</ToggleButton>
                <ToggleButton value={3}>Wed</ToggleButton>
                <ToggleButton value={4}>Thu</ToggleButton>
                <ToggleButton value={5}>Fri</ToggleButton>
                <ToggleButton value={6}>Sat</ToggleButton>
                <ToggleButton value={7}>Sun</ToggleButton>
            </ToggleButtonGroup>
            {tasks.map((task) => {
                return <TaskToComplete key={id + task.id} task={task} completeTask={completeTask} updateRoutineCompletion={updateRoutineCompletionID} activeToday={activeToday}
                                alreadyCompleted={taskProgress.find(element => element.id === task.id)?.amount === task.requirementAmount  ? true : false} amountComplete={taskProgress.find(element => element.id === task.id)?.amount}></TaskToComplete>
            })}
            <Typography>
                Status: {routineStatus}
            </Typography>
            {activeToday && <Typography>Tasks left for today {tasks.length - taskProgress.filter(task => (task.completed === true)).length}</Typography>}
            <LinearProgress sx={{mt: 2}} variant="determinate" value={taskProgress.filter(task => (task.completed === true)).length != 0 ? (taskProgress.filter(task => (task.completed === true)).length / tasks.length) * 100 : 0} />
        </Box>
    );
}

export default Routine;