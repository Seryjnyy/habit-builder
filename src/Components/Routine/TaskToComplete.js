import React, {useState} from 'react';
import {Box, Button, Typography} from "@mui/material";

function TaskToComplete({task, completeTask, activeToday}) {
    const [completed, setCompleted] = useState(false);

    const taskCompleted = () => {
        setCompleted(true);
        completeTask(task.id);
    }

    return (
        <Box sx={{backgroundColor: "lightBlue", mb:1, mt:1}}>
            <Typography>{task.requirementType}</Typography>
            <Typography>{task.requirementAmount}</Typography>
            <Button disabled={(!activeToday || completed)} onClick={() => taskCompleted()}>Completed</Button>
        </Box>
    );
}

export default TaskToComplete;