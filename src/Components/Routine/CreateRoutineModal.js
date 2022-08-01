import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel, List,
    Modal,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import AddDocModal from "../../AddDocModal";

function CreateRoutineModal(props) {
    const [openModal, setOpenModal] = useState(false);
    const [routineType, setRoutineType] = useState("None");
    const [createRoutineInterface, setCreateRoutineInterface] = useState(<div>nothing</div>);

    const createCustomRoutineInterface = <><TextField id="outlined-basic" label="Routine name" variant="outlined" /></>

    useEffect(() => {
        console.log(routineType)
        switch(routineType){
            case "Morning routine":
                return setCreateRoutineInterface(<div> m routine</div>);
                break;
            case "Bed routine":
                return setCreateRoutineInterface(<div> b routine </div>);
                break;
            case "Custom":
                setCreateRoutineInterface(createCustomRoutineInterface);
                break;
            default:
                setCreateRoutineInterface(<div> nothing </div>);
                break
        }
    }, [routineType]);


    const routineTypes = [
        {label: "Morning routine"},
        {label: "Bed routine"},
        {label: "Custom"}
    ]

    return (
        <>
        <Button onClick={() => setOpenModal(true)}>Create routine</Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="modal-modal-title">
            <div>
                <ModalBox>
                    <Stack>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                            Create a new routine
                        </Typography>
                        <Autocomplete renderInput={(params) => <TextField {...params}/>} options={routineTypes} onChange={(e, value) => {setRoutineType(value?.label)}}/>
                        {createRoutineInterface}
                        <Typography>Tasks in routine</Typography>
                        <List>
                        </List>
                        <AddDocModal></AddDocModal>
                        <Button>Create routine</Button>
                    </Stack>
                </ModalBox>
            </div>
        </Modal>
        </>
    );
}

export default CreateRoutineModal;