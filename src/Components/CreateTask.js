import React, {useState} from 'react';
import {Autocomplete, Button, IconButton, Snackbar, Stack, TextField, Typography} from "@mui/material";
import LabelSelect from "./Task/LabelSelect";
import {addTask} from "../Services/addTask";
import {useAuth} from "./Auth/UserAuthContext";
import CloseIcon from "@mui/icons-material/Close";

function CreateTask({availableTags, actionAfterSubmission, setSnackbarMessage}){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completionRequirementType, setCompletionRequirementType] = useState("null");
    const [tags, setTags] = useState([]);

    let {user} = useAuth();

    const completionRequirementTypes = ["Time", "Amount", "Completion"];

    const handleClick = () => {
        const tagsOnly = tags.map(tag => tag.value);

        addTask(user.uid, name, description, completionRequirementType, tagsOnly)
            .then(() => {
                if(setSnackbarMessage != undefined)
                    setSnackbarMessage("Task created.");
            })
            .catch((e) => {
                if(setSnackbarMessage != undefined)
                    setSnackbarMessage(e.message);
            });
    };

    return (
        <>
            <Stack>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                    Create a new task
                </Typography>
                <TextField id="outlined-basic" label="Name" variant="outlined"
                           onChange={(e) => setName(e.target.value)}/>
                <TextField id="outlined-basic" label="Description" variant="outlined"
                           onChange={(e) => setDescription(e.target.value)}/>
                <Autocomplete renderInput={(params) => <TextField {...params}/>}
                              options={completionRequirementTypes} onChange={(e, value) => {
                    setCompletionRequirementType(value);
                }}/>
                <LabelSelect value={tags} setValue={setTags} availableTags={availableTags.map(tag => ({
                    value: tag,
                    name: tag,
                    createdNow: false
                }))}/>

                <Button
                    onClick={() => {
                        handleClick();
                        if(actionAfterSubmission != undefined)
                            actionAfterSubmission();
                    }}
                >
                    Add record
                </Button>
            </Stack>
        </>
    );
}

export default CreateTask;