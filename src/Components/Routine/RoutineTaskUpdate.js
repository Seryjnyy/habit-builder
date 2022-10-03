import React, {useState} from 'react';
import {Button, Paper, TextField} from "@mui/material";

function RoutineTaskUpdate({id, requirementType, requirementAmount, isAdded, updateTask, updateAmount, disableOptions}){
    // If task is a completion amount then default amount to 1, otherwise use given amount value
    const [amount, setAmount] = useState(requirementType === "Completion" ? 1 : (requirementAmount ? requirementAmount : 9));
    const [debounce, setDebounce] = useState(null);

    const handleUpdateAmount = (newAmount) => {
        setAmount(newAmount);

        if(debounce)
            clearTimeout(debounce);

        setDebounce(
            setTimeout(() => {
            updateAmount(id, newAmount);
        }, 1000))
    }

    return (
        <Paper sx={{display: "flex", justifyContent: "space-between", minWidth:600}} variant={"outlined"}>
            {id}
            {requirementType != "Completion" && <TextField sx={{mt:2}} disabled={disableOptions} type={"number"} label={requirementType} value={amount} onChange={(e) => handleUpdateAmount(Number(e.target.value))}></TextField>}
            <Button disabled={!isAdded || disableOptions} onClick={() => updateTask(id, true, amount)}>Remove</Button>
            <Button disabled={isAdded || disableOptions} onClick={() => updateTask(id, false, amount)}>Add</Button>
        </Paper>
    );
}

export default RoutineTaskUpdate;