import React, {useState} from 'react';
import {Button, Paper, TextField} from "@mui/material";

function RoutineTaskUpdate({id, requirementType, requirementAmount, isAdded, updateTask}){
    const [amount, setAmount] = useState(requirementAmount ? requirementAmount : 5);

    console.log("rerender");
    return (
        <Paper sx={{display: "flex", justifyContent: "space-between", minWidth:600}} variant={"outlined"}
               key={id}>
            {id}
            {requirementType != "Completion" && <TextField sx={{mt:2}} disabled={false} type={"number"} label={requirementType} value={amount} onChange={(e) => setAmount(e.target.value)}></TextField>}
            <Button disabled={!isAdded} onClick={() => updateTask(id, true, amount)}>Remove</Button>
            <Button disabled={isAdded} onClick={() => updateTask(id, false, amount)}>Add</Button>
        </Paper>
    );
}

export default RoutineTaskUpdate;