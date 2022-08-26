import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import TaskToComplete from "./TaskToComplete";

function Routine({id, name, description, days, activeToday, tasks, completeRoutine, tasksCompletedToday, alreadyComplete, updateRoutineCompletion}) {
    const [tasksCompleted, setTasksCompleted] = useState(tasksCompletedToday); // this will probably be injected
    const [completed, setCompleted] = useState(alreadyComplete);

    const completeTask = (taskID) => {
        setTasksCompleted([...tasksCompleted, taskID]);
        // updateRoutineCompletion
    }

    const [routineStatus, setRoutineStatus] = useState("")

    useEffect(() => {
        // console.log("task am    ount " + tasks.length + " finished " + tasksCompletedToday.length)
        if(completed)
            setRoutineStatus("Finished");
        else if(activeToday)
            setRoutineStatus("Active");
        else
            setRoutineStatus("Not today");

    }, [completed]);

    // needs to check if it has been completed already
    useEffect(() => {
        if(tasksCompleted.length === tasks.length && activeToday && tasks.length > 0 && !alreadyComplete){
            completeRoutine(id, tasksCompleted);
            setCompleted(true);

        }
    }, [tasksCompleted]);

    const updateRoutineCompletionID = (taskID) => {
        updateRoutineCompletion(id, taskID);
    }

    return (
        <Box sx={{backgroundColor : "yellow", mb: 2}}>
            <Typography>{name}</Typography>
            <Typography>{description}</Typography>
            <Typography>{days}</Typography>
            {tasks.map((task) => {
                let taskAlreadyComplete = false;
                tasksCompletedToday.forEach((completedTaskID) => {
                    if(completedTaskID == task.id){
                        taskAlreadyComplete = true;
                        return;
                    }
                })
                return <TaskToComplete key={id + task.id} task={task} completeTask={completeTask} updateRoutineCompletion={updateRoutineCompletionID} activeToday={activeToday}
                                alreadyCompleted={taskAlreadyComplete} ></TaskToComplete>
            })}
            <Typography>
                {routineStatus}
            </Typography>
            {activeToday && <Typography>Tasks left for today {tasks.length - tasksCompleted.length}</Typography>}
        </Box>
    );
}

export default Routine;