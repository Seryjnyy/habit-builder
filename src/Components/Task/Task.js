import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    createTheme,
    FormControl, FormControlLabel,
    Modal, Stack, TextField,
    Typography
} from "@mui/material";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase"

function Task({id, title, description, completed}) {
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(completed);
    const [taskDescription, setTaskDescription] = useState(description);
    const [descriptionWordCount, setDescriptionWordCount] = useState(0);

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

    const changeCompleted = async () => {

        try{
            const taskDocRef = doc(db, "tasks", id);
            await updateDoc(taskDocRef, { completed: !taskCompleted});
            setTaskCompleted(!taskCompleted);
        }catch(err){
            alert(err);
        }
    }

    const deleteTask = async () => {
        try{
            const taskDocRef = doc(db, "tasks", id);
            await deleteDoc(taskDocRef);
        }catch(err){
            alert(err);
        }
    }

    const updateLocalDescriptionAndCount = () => {
        // setTaskDescription()
    }

    return (
        <>
            <Box>
                <Card sx={{mb:2}}>
                    <CardContent>
                        <Typography>{id}</Typography>
                        <Typography>{title}</Typography>
                        <Typography>{description}</Typography>
                        <Typography>{taskCompleted ? "completed" : "not completed"}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {deleteTask()}}>Delete</Button>
                        <Button onClick={() => {setUpdateModalOpen(true)}}>Update</Button>
                        <Modal
                            open={updateModalOpen}
                            onClose={() => setUpdateModalOpen(false)}
                            aria-labelledby="modal-modal-title"
                        >
                            <Box sx={style}>
                                <Stack>
                                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                                        Update task
                                    </Typography>

                                    <TextField
                                        id="outlined-helperText"
                                        label="Helper text"
                                        onChange={() => updateLocalDescriptionAndCount()}
                                        defaultValue="Default Value"
                                        helperText={descriptionWordCount + "/200"}
                                    />
                                    <FormControlLabel control={ <Checkbox/>} label={"completed"} checked={taskCompleted} onChange={() => changeCompleted()} ></FormControlLabel>
                                </Stack>
                            </Box>
                        </Modal>
                    </CardActions>
                </Card>
            </Box>

        </>
    );
}

export default Task;