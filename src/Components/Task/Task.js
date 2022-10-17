import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox, Chip,
    createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    FormControl, FormControlLabel,
    Modal, Stack, TextField,
    Typography
} from "@mui/material";
import {doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import LabelSelect from "./LabelSelect";
import {deleteTask} from "../../Services/deleteTask";
import UpdateTaskModal from './UpdateTaskModal';

function Task({task, availableTags, setSnackbarMessage}){
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);

    const [taskDescription, setTaskDescription] = useState(task.data.description);
    // const [descriptionWordCount, setDescriptionWordCount] = useState(0);
    const [taskTags, setTaskTags] = useState(task.data.tags?.map(tag => ({value: tag, name: tag, createdNow: false})));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };

    const updateTask = () => {

        // convert tags to pure form
        const finalTags = taskTags.map((tag) => tag.value);

        const taskRef = doc(db, "tasks", task.id);
        setDoc(taskRef, {
            description: taskDescription,
            tags: finalTags
        }, {merge: true})
            .then(() => {if(setSnackbarMessage != undefined) setSnackbarMessage("Task updated.")})
            .catch((e) => {if(setSnackbarMessage != undefined) setSnackbarMessage("Failed to update task.")});

        setUpdateModalOpen(false);
    };


    const handleDeleteTask = (taskID) => {
        // cant set the snackbar message
        deleteTask(taskID)
            .then(() => {if(setSnackbarMessage != undefined) setSnackbarMessage("Task deleted.")})
            .catch(() => {if(setSnackbarMessage != undefined) setSnackbarMessage("Failed to delete task.")});
    };

    return (
        <>
            <Box>
                <Card sx={{mb: 2}}>
                    <CardContent>
                        {/*<Typography>{id}</Typography>*/}
                        <Typography>Name: {task.data.name}</Typography>
                        <Typography>Description: {task.data.description}</Typography>
                        <Typography>in routines: {task.data.inRoutines ? "it is" : "no"}</Typography>
                        <Typography>Completion requirement type: {task.data.completionRequirementType}</Typography>
                        {console.log(task.data.name) }
                        {console.log(taskTags)}
                        {taskTags?.map(tag => (
                            <Chip key={tag.value} label={tag.value} sx={{mr: 1}}></Chip>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {
                            setUpdateModalOpen(true);
                        }}>Update</Button>
                        <Button onClick={() => {
                            setOpenDeleteTaskDialog(true);
                        }}>Delete</Button>
                        <Dialog
                            open={openDeleteTaskDialog}
                            onClose={() => setOpenDeleteTaskDialog(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Are you sure you want to delete this task?
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {task.data.inRoutines ? "Sorry can't delete task because it's used in your routines." : "This will remove the task permanently."}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleDeleteTask(task.id)}
                                        disabled={task.data.inRoutines}>Delete</Button>
                                <Button onClick={() => setOpenDeleteTaskDialog(false)} variant={"contained"} autoFocus>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {updateModalOpen && <UpdateTaskModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} description={task.data.description} id={task.id} tags={task.data.tags} availableTags={availableTags}></UpdateTaskModal>}
                    </CardActions>
                </Card>
            </Box>

        </>
    );
}

export default Task;