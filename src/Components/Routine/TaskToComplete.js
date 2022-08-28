import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";

function TaskToComplete({task, completeTask, activeToday, alreadyCompleted, updateRoutineCompletion, amountComplete}) {
    const [completed, setCompleted] = useState(alreadyCompleted);
    const [amount, setAmount] = useState(amountComplete === undefined ? 0 : amountComplete);

    const taskCompleted = () => {
        setCompleted(true);
        completeTask(task.id);
    }

    return (
        <Box sx={{backgroundColor: "lightBlue", mb:1, mt:1, p:2, borderRadius: 2}}>
            <Box sx={{mb:2}}>
                <Typography>ID: {task.id}</Typography>
                <Typography>Requirement type: {task.requirementType}</Typography>
                <Typography>Requirement amount: {task.requirementAmount}</Typography>
            </Box>

            <TextField disabled={(!activeToday || completed)} type={"number"} label={task.requirementType} value={amount} onChange={(e) => setAmount(Number(e.target.value))}></TextField>
            <Button disabled={(!activeToday || completed)} onClick={() => {
                setCompleted(true);
                setAmount(task.requirementAmount)
                updateRoutineCompletion(task.id, task.requirementAmount, task.requirementAmount)
            }}>Completed</Button>
            <Button disabled={(!activeToday || completed)} onClick={() => {
                if(amount === task.requirementAmount)
                    setCompleted(true);
                updateRoutineCompletion(task.id, amount, task.requirementAmount)
            }}>Save Progress</Button>
        </Box>
    );
}

export default TaskToComplete;