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
    import {doc, updateDoc} from "firebase/firestore";
    import {db} from "../../firebase"

    function Task({id, name, description, completionRequirementType}) {
        const [updateModalOpen, setUpdateModalOpen] = useState(false);

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

        const updateLocalDescriptionAndCount = () => {
            // setTaskDescription()
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
                                            onChange={() => updateLocalDescriptionAndCount()}
                                            defaultValue="Default Value"
                                            helperText={descriptionWordCount + "/200"}
                                        />
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