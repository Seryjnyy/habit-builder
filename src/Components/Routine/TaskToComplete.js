import React, {useState} from 'react';
import {Box, Button, Typography} from "@mui/material";

function TaskToComplete({task, completeTask, activeToday, alreadyCompleted, updateRoutineCompletion}) {
    const [completed, setCompleted] = useState(alreadyCompleted);

    const taskCompleted = () => {
        setCompleted(true);
        completeTask(task.id);
    }

    return (
        <Box sx={{backgroundColor: "lightBlue", mb:1, mt:1}}>
            <Typography>{task.requirementType}</Typography>
            <Typography>{task.requirementAmount}</Typography>
            <Button disabled={(!activeToday || completed)} onClick={() => taskCompleted()}>Completed</Button>
            <Button onClick={() => updateRoutineCompletion(task.id)}>Progress</Button>
        </Box>
    );
}

export default TaskToComplete;