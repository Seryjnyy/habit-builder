import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import TaskToComplete from "./TaskToComplete";

function Routine({id, name, description, days, activeToday, tasks, completeRoutine}) {
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksCompletedAmount, setTasksCompletedAmount] = useState(0);

    const completeTask = (taskID) => {
        tasksCompleted.push(taskID);
        setTasksCompletedAmount(tasksCompleted.length)
    }

    useEffect(() => {
        if(tasksCompletedAmount === tasks.length)
            completeRoutine(id);
    }, [tasksCompletedAmount]);


    return (
        <Box sx={{backgroundColor : "yellow", mb: 2}}>
            <Typography>{name}</Typography>
            <Typography>{description}</Typography>
            <Typography>{days}</Typography>
            {tasks.map((task) => (
                <TaskToComplete key={id + task.id} task={task} completeTask={completeTask} activeToday={activeToday}></TaskToComplete>
            ))}
            <Typography>
                {activeToday ? "Active" : "Not today"}
            </Typography>
            {activeToday && <Typography>Tasks left for today {tasks.length - tasksCompleted.length}</Typography>}
        </Box>
    );
}

export default Routine;