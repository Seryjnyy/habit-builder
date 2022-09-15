    import React, {useState} from 'react';
    import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox, Chip,
    createTheme,
    FormControl, FormControlLabel,
    Modal, Stack, TextField,
    Typography
} from "@mui/material";
    import {doc, updateDoc} from "firebase/firestore";
    import {db} from "../../firebase"
    import LabelSelect from "./LabelSelect";

    function Task({id, name, description, completionRequirementType, tags, availableTags}) {
        const [updateModalOpen, setUpdateModalOpen] = useState(false);

        const [taskDescription, setTaskDescription] = useState(description);
        const [descriptionWordCount, setDescriptionWordCount] = useState(0);
        const [taskTags, setTaskTags] = useState(tags?.map(tag => ({value:tag, name:tag, createdNow:false})));

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

        const updateLocalDescriptionAndCount = () => {
            // setTaskDescription()
        }

        const updateTask = () => {

        }

        return (
            <>
                <Box>
                    <Card sx={{mb:2}}>
                        <CardContent>
                            {/*<Typography>{id}</Typography>*/}
                            <Typography>Name: {name}</Typography>
                            <Typography>Description: {description}</Typography>
                            <Typography>Completion requirement type: {completionRequirementType}</Typography>
                            {taskTags?.map(tag => (
                                <Chip key={tag.value} label={tag.value} sx={{mr:1}}></Chip>
                            ))}
                        </CardContent>
                        <CardActions>
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
                                            value={taskDescription != undefined ? taskDescription : ""}
                                            onChange={(e) => {
                                                setTaskDescription(e.target.value)
                                                updateLocalDescriptionAndCount();
                                            }}
                                            helperText={descriptionWordCount + "/200"}
                                        />
                                        <Typography>Remove and Add tags</Typography>
                                        <Box>
                                            {/*needs the autocomplete from addDocModal*/}
                                            {/*now needs to actually update the doc if there are changes*/}
                                            <LabelSelect value={taskTags != undefined ? taskTags : []} setValue={setTaskTags} availableTags={availableTags.map(tag => ({value:tag, name:tag, createdNow:false}))}/>
                                        </Box>
                                    </Stack>
                                    <Button onClick={updateTask}>Update</Button>
                                </Box>
                            </Modal>
                        </CardActions>
                    </Card>
                </Box>

            </>
        );
    }

    export default Task;