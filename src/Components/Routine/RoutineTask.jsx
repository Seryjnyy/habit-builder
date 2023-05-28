import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, Chip,
    Modal, Paper, Stack, TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";

function RoutineTask({id, name, description, completionRequirementType, tags, addTaskToRoutine, removeTaskFromRoutine}) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        console.log("we rerendering babty");
    }, []);


    const [added, setAdded] = useState(false);
    const [amount, setAmount] = useState(1);
    const taskRequirementLabel = completionRequirementType === "Time" ? "Minutes" : "Repetitions";

    const setAmountProxy = (num) => {
        if(num < 0 || num > 999)
            return;

        setAmount(num);
    }

    const addTask = () => {
        addTaskToRoutine(id, completionRequirementType, amount);
        setAdded(true);
    }

    const removeTask = () => {
        removeTaskFromRoutine(id);
        setAdded(false);
    }

    return (
            <Paper variant={"outlined"}  sx={{mb: 1, mt: 0, p: 2, borderRadius: 2}}>
                        <Typography>Name: {name}</Typography>
                        <Typography>Description: {description}</Typography>
                        <Typography>Completion requirement type: {completionRequirementType}</Typography>
                        {tags?.map(tag => (
                            <Chip key={tag} label={tag} sx={{mr:1}}></Chip>
                        ))}
                        {completionRequirementType != "Completion" && <TextField sx={{mt:2}} disabled={added} type={"number"} label={taskRequirementLabel} value={amount} onChange={(e) => setAmountProxy(Number(e.target.value))}></TextField>}
                        <Button sx={{mt:3}} disabled={added} onClick={addTask}>Add</Button>
                        <Button sx={{mt:3}} disabled={!added} onClick={removeTask}>Remove</Button>
            </Paper>
    );
}

export default RoutineTask;