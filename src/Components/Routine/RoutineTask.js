import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Modal, Stack, TextField,
    Typography
} from "@mui/material";
import {useState} from "react";

function RoutineTask({id, name, description, completionRequirementType, addTaskToRoutine, removeTaskFromRoutine}) {
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

    const [added, setAdded] = useState(false);
    const [amount, setAmount] = useState(5);
    const taskRequirementLabel = completionRequirementType === "Time" ? "Minutes" : "Repetitions";

    const addTask = () => {
        addTaskToRoutine(id, completionRequirementType, amount);
        setAdded(true);
    }

    const removeTask = () => {
        removeTaskFromRoutine(id);
        setAdded(false);
    }

    return (
        <>
            <Box>
                <Card sx={{mb:2}}>
                    <CardContent>
                        <Typography>Name: {name}</Typography>
                        <Typography>Description: {description}</Typography>
                        <Typography>Completion requirement type: {completionRequirementType}</Typography>
                        <TextField disabled={added} type={"number"} label={taskRequirementLabel} value={amount} onChange={(e) => setAmount(Number(e.target.value))}></TextField>
                        <Button disabled={added} onClick={addTask}>Add</Button>
                        <Button disabled={!added} onClick={removeTask}>Remove</Button>
                    </CardContent>
                </Card>
            </Box>

        </>
    );
}

export default RoutineTask;