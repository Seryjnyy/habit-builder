import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
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
        <Box sx={{backgroundColor : "yellow", mb: 2}}>
            <Typography>{id}</Typography>
            <Typography>{name}</Typography>
            <Typography>{description}</Typography>
            <Typography>{days}</Typography>
            {tasks.map((task) => {
                return <TaskToComplete key={id + task.id} task={task} completeTask={completeTask} updateRoutineCompletion={updateRoutineCompletionID} activeToday={activeToday}
                                alreadyCompleted={taskProgress.find(element => element.id === task.id)?.amount === task.requirementAmount  ? true : false} amountComplete={taskProgress.find(element => element.id === task.id)?.amount}></TaskToComplete>
            })}
            <Typography>
                {routineStatus}
            </Typography>
            {activeToday && <Typography>Tasks left for today {tasks.length - taskProgress.filter(task => (task.completed === true)).length}</Typography>}
        </Box>
    );
}

export default Routine;