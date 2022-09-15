import React, {useEffect, useState} from 'react';
import {Box, Button, Chip, LinearProgress, Paper, TextField, Typography} from "@mui/material";

function TaskToComplete({task, activeToday, alreadyCompleted, updateRoutineCompletion, amountComplete}){
    const [completed, setCompleted] = useState(alreadyCompleted);
    const [amount, setAmount] = useState(amountComplete === undefined ? 0 : amountComplete);
    const [updateCallTimeout, setUpdateCallTimeout] = useState();

    useEffect(() => {
        console.log(task.taskInfo.tags);
    }, []);


    const setAmountProxy = (num) => {
        if(num > task.requirementAmount || num < 0)
            return;

        clearTimeout(updateCallTimeout);

        setAmount(num);

        // task is completed
        // avoid debounce for this just update
        if(num === task.requirementAmount){
            updateRoutineCompletion(task.id, task.requirementAmount, task.requirementAmount)
            setCompleted(true);
            return;
        }

        setUpdateCallTimeout(setTimeout(() => {
            updateRoutineCompletion(task.id, num, task.requirementAmount)
        }, 1000))
    };

    return (
        <Paper variant={"outlined"} sx={{mb: 1, mt: 0, p: 2, borderRadius: 2}}>
            <Box sx={{mb: 2}}>
                {/*<Typography>ID: {task.id}</Typography>*/}
                <Typography sx={{fontSize: 20}}>{task.taskInfo.name}</Typography>
                {task.taskInfo?.tags?.map(tag => (
                    <Chip key={tag} label={tag} sx={{mr:1}}></Chip>
                ))}
                {/*<Typography>Description: {task.taskInfo.description}</Typography>*/}
                {/*<Typography>Required: {task.requirementAmount}</Typography>*/}
            </Box>

            {task.requirementType != "Completion" &&  <TextField disabled={(!activeToday || completed)} type={"number"} label={task.requirementType}
                          value={amount} onChange={(e) => setAmountProxy(Number(e.target.value))}></TextField>}

            <Button disabled={(!activeToday || completed)} onClick={() => {
                setCompleted(true);
                setAmount(task.requirementAmount);
                updateRoutineCompletion(task.id, task.requirementAmount, task.requirementAmount);
            }}>Completed</Button>

            <LinearProgress sx={{mt: 2}} variant="determinate"
                            value={amount != 0 ? (amount / task.requirementAmount) * 100 : 0}/>
        </Paper>
    );
}

export default TaskToComplete;