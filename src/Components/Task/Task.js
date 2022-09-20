    import React, {useState} from 'react';
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
    import {db} from "../../firebase"
    import LabelSelect from "./LabelSelect";

    function Task({task, availableTags}) {
        const [updateModalOpen, setUpdateModalOpen] = useState(false);
        const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);

        const [taskDescription, setTaskDescription] = useState(task.data.description);
        // const [descriptionWordCount, setDescriptionWordCount] = useState(0);
        const [taskTags, setTaskTags] = useState(task.data.tags?.map(tag => ({value:tag, name:tag, createdNow:false})));

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

        const updateTask = () => {

            // convert tags to pure form
            const finalTags = taskTags.map((tag) => tag.value);

            const taskRef = doc(db, "tasks", task.id);
            setDoc(taskRef, {
                description: taskDescription,
                tags: finalTags
            }, {merge:true}).catch((e) => alert(e.message()));
            setUpdateModalOpen(false);
        }


        return (
            <>
                <Box>
                    <Card sx={{mb:2}}>
                        <CardContent>
                            {/*<Typography>{id}</Typography>*/}
                            <Typography>Name: {task.data.name}</Typography>
                            <Typography>Description: {task.data.description}</Typography>
                            <Typography>in routines: {task.data.inRoutines ? "it is" : "no"}</Typography>
                            <Typography>Completion requirement type: {task.data.completionRequirementType}</Typography>
                            {taskTags?.map(tag => (
                                <Chip key={tag.value} label={tag.value} sx={{mr:1}}></Chip>
                            ))}
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => {setUpdateModalOpen(true)}}>Update</Button>
                            <Button onClick={() => {setOpenDeleteTaskDialog(true)}}>Delete</Button>
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
                                        Let Google help apps determine location. This means sending anonymous
                                        location data to Google, even when no apps are running.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button>Disagree</Button>
                                    <Button  autoFocus>
                                        Agree
                                    </Button>
                                </DialogActions>
                            </Dialog>
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
                                            sx={{mb:2}}
                                            id="outlined-helperText"
                                            label="Description"
                                            value={taskDescription != undefined ? taskDescription : ""}
                                            onChange={(e) => {
                                                setTaskDescription(e.target.value)
                                            }}
                                        />
                                        <Box>
                                            {/*needs the autocomplete from addDocModal*/}
                                            {/*now needs to actually update the doc if there are changes*/}
                                            <LabelSelect value={taskTags != undefined ? taskTags : []} setValue={setTaskTags} availableTags={availableTags.map(tag => ({value:tag, name:tag, createdNow:false}))}/>
                                        </Box>
                                    </Stack>
                                    <Button sx={{mt:4}} onClick={updateTask}>Update</Button>
                                </Box>
                            </Modal>
                        </CardActions>
                    </Card>
                </Box>

            </>
        );
    }

    export default Task;