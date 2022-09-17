import React, {useState} from "react";
import {Autocomplete, Button, IconButton, List, Modal, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {useAuth} from "./Auth/UserAuthContext";
import ModalBox from "./Modal/ModalBox";
import LabelSelect from "./Task/LabelSelect";
import CloseIcon from "@mui/icons-material/Close";
import {addTask} from "../Services/addTask";

function AddDocModal({onClose, availableTags, open}){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completionRequirementType, setCompletionRequirementType] = useState("null");
    const [tags, setTags] = useState([]);

    let {user} = useAuth();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
    };
    const snackbarAction = (
        <>
            {/*<Button size={"small"} onClick={handleCloseSnackbar}>reload it</Button>*/}
            <IconButton
                size={"small"}
                onClick={handleCloseSnackbar}
            >
                <CloseIcon fontSize={"small"}></CloseIcon>
            </IconButton>
        </>
    );



    const handleClick = async () => {
        // console.log(name);
        // console.log(description);
        // console.log(completionRequirementType);
        // console.log(tags);

        const tagsOnly = tags.map(tag => tag.value);

        addTask(user.uid, name, description, completionRequirementType, tagsOnly)
            .then(() => setSnackbarMessage("Task created."))
            .catch(() => setSnackbarMessage("Couldn't create the task."));
    };

    const completionRequirementTypes = ["Time", "Amount", "Completion"];

    return (
        <>
            <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
                <div>
                    <ModalBox>
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
                                    onClose();
                                    handleClick();
                                }}
                            >
                                Add record
                            </Button>
                        </Stack>
                    </ModalBox>
                </div>
            </Modal>
            <Snackbar
                open={snackbarMessage != ""}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                action={snackbarAction}
            >
            </Snackbar>
        </>
    );
}

export default AddDocModal;
