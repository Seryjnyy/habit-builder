import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel, List,
    Modal,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import AddDocModal from "../../AddDocModal";
import {useAuth} from "../Auth/UserAuthContext";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../firebase";
import Task from "../Task/Task";

function CreateRoutineModal(props) {
    const [openModal, setOpenModal] = useState(false);
    const [routineType, setRoutineType] = useState("");
    const [routineName, setRoutineName] = useState("");
    const [routineTasks, setRoutineTasks] = useState([]);
    const [routineDays, setRoutineDays] = useState([]);

    const routineTypes = ["Morning routine", "Bed routine", "In-between routine"]

    const [userTasks, setUserTasks] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        const q = query(collection(db, "tasks"), orderBy("created", "desc"));
        onSnapshot(q, (querySnapshot) => {
            setUserTasks(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        });
    }, []);

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
                        <Typography>Name of routine</Typography>
                        <TextField onChange={(e) => {setRoutineName(e.target.value)}}></TextField>

                        <Typography>Type</Typography>
                        <Autocomplete renderInput={(params) => <TextField {...params}/>} options={routineTypes} onChange={(e, value) => {setRoutineType(value?.label)}}/>

                        <Typography>Tasks in routine</Typography>
                        <List>
                            {userTasks.map(task => (
                                <Task id={task.id} key={task.id} title={task.data.title} description={task.data.description} completed={task.data.completed}></Task>
                            ))}
                        </List>

                        <Typography>Repeat days</Typography>
                        <ToggleButtonGroup color={"primary"} value={routineDays} onChange={(event, newDays) => {setRoutineDays(newDays)}}>
                            <ToggleButton value={"monday"}>Mon</ToggleButton>
                            <ToggleButton value={"tuesday"}>Tus</ToggleButton>
                            <ToggleButton value={"wednesday"}>Wed</ToggleButton>
                            <ToggleButton value={"thursday"}>Thu</ToggleButton>
                            <ToggleButton value={"friday"}>Fri</ToggleButton>
                            <ToggleButton value={"saturday"}>Sat</ToggleButton>
                            <ToggleButton value={"sunday"}>Sun</ToggleButton>
                        </ToggleButtonGroup>
                        <Button>Create routine</Button>
                    </Stack>
                </ModalBox>
            </div>
        </Modal>
        </>
    );
}

export default CreateRoutineModal;