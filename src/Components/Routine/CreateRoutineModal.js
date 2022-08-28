import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox, Divider,
    FormControlLabel, List,
    Modal,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import AddDocModal from "../../AddDocModal";
import {useAuth} from "../Auth/UserAuthContext";
import {addDoc, collection, onSnapshot, orderBy, query, Timestamp, where} from "firebase/firestore";
import {db} from "../../firebase";
import Task from "../Task/Task";
import TaskPlain from "./TaskPlain";
import RoutineTask from "./RoutineTask";

function CreateRoutineModal(props) {
    const [openTaskCreationModal, setOpenTaskCreationModal] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [routineName, setRoutineName] = useState("");
    const [routineDescription, setRoutineDescription] = useState("");
    const [routineDays, setRoutineDays] = useState([]);
    // const [routineType, setRoutineType] = useState("");
    // const routineTypes = ["Morning routine", "Bed routine", "In-between routine"]
    const [userTasks, setUserTasks] = useState([]);
    const {user} = useAuth();

    const [routineTasksError, setRoutineTasksError] = useState("");
    const [routineDaysError, setRoutineDaysError] = useState("");

    const [routineTasks, setRoutineTasks] = useState([]);
    const [routineTasksLength, setRoutineTasksLength] = useState(0);

    const addTask = (id, requirementType, requirementAmount) => {
        routineTasks.push({"id" : id, "requirementType" : requirementType, "requirementAmount" : requirementAmount });

        setRoutineTasksLength(routineTasks.length);

        if(routineTasks.length <= 10){
            if(routineTasksError != "")
                setRoutineTasksError("");
        }
    };

    const removeTask = (id) => {
        let index = routineTasks.map((task) => {
            return task;
        }).indexOf(id);

        routineTasks.splice(index, 1);

        setRoutineTasksLength(routineTasks.length);

        if(routineTasks.length <= 0)
            setRoutineTasksError("Routine requires at least 1 task.");
    };

    // fetches tasks
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


    const validateAndAddRoutine = () => {
        if(routineName.length <= 0){
            setNameError("Routine requires a name.")
            return;
        }

        if(routineName.length > 50)
            return;

        if(routineDescription.length > 50)
            return;

        if(routineTasks.length <= 0){
            setRoutineTasksError("Routine requires at least 1 task.");
            return;
        }

        if(routineTasks.length > 10){
            setRoutineTasksError("Routine can't have more than 10 tasks.");
            return;
        }

        if(routineDays.length <= 0){
            setRoutineDaysError("Routine needs at least 1 repeating day.")
            return;
        }

        setRoutineDaysError("");
        setRoutineTasksError("");

        try{
            addDoc(collection(db, "routine"), {
                userID : user.uid,
                name: routineName,
                description: routineDescription,
                tasks: routineTasks,
                days: routineDays,
                created: Timestamp.now()
            });

            setRoutineDays([]);
            setRoutineTasks([]);
            setRoutineTasksLength(0);
        }catch(err){
            alert(err);
        }
        setOpenModal(false);
    }

    const setRoutineDaysProxy = (newDays) => {
        setRoutineDays(newDays);

        if(routineDaysError != "")
            setRoutineDaysError("");
    }

    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    const validateName = (val) => {
        if(val.length === 0){
            setNameError("Routine requires a name.")
            return;
        }

        if(val.length > 50){
            setNameError("Routine name must be less than 50 characters long.")
            return;
        }

        setRoutineName(val);
        setNameError("");
    }

    const validateDescription = (val) => {
        if(val.length > 50){
            setDescriptionError("Routine description must be less than 50 characters long.")
            return;
        }

        setRoutineDescription(val);
        setDescriptionError("");
    }

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

                        <TextField sx={{mb:1}} error={nameError != ""} helperText={nameError} label={"Name"} onChange={(e) => {validateName(e.target.value)}}></TextField>

                        <TextField sx={{mb:3}} error={descriptionError != ""} helperText={descriptionError != "" ? descriptionError : "*optional"} label={"Description"} onChange={(e) => {validateDescription(e.target.value)}}></TextField>

                        {/*<Typography>Type</Typography>*/}
                        {/*<Autocomplete renderInput={(params) => <TextField {...params}/>} options={routineTypes} onChange={(e, value) => {setRoutineType(value?.label)}}/>*/}

                        <Typography>Tasks in routine : {routineTasksLength}</Typography>
                        <Typography sx={{color:"#D32F2F", fontSize:12, ml:2}}>{routineTasksError}</Typography>
                        <Divider></Divider>
                        <List>
                            {userTasks.map(task => (
                                <Box sx={{mb:1, mt:1}} key={task.id}>
                                    <RoutineTask id={task.id} name={task.data.name} description={task.data.description} completionRequirementType={task.data.completionRequirementType} addTaskToRoutine={addTask} removeTaskFromRoutine={removeTask}></RoutineTask>
                                </Box>

                            ))}
                        </List>
                        <Button sx={{mb:1}} onChange={() => setOpenTaskCreationModal(true)}>Create task</Button>
                        {openTaskCreationModal && <AddDocModal></AddDocModal>}
                        <Divider sx={{mb:3}}></Divider>

                        <Typography>Repeat days</Typography>
                        <ToggleButtonGroup sx={{mb: 1}} color={"primary"} value={routineDays} onChange={(event, newDays) => {setRoutineDaysProxy(newDays)}}>
                            <ToggleButton value={1}>Mon</ToggleButton>
                            <ToggleButton value={2}>Tus</ToggleButton>
                            <ToggleButton value={3}>Wed</ToggleButton>
                            <ToggleButton value={4}>Thu</ToggleButton>
                            <ToggleButton value={5}>Fri</ToggleButton>
                            <ToggleButton value={6}>Sat</ToggleButton>
                            <ToggleButton value={7}>Sun</ToggleButton>
                        </ToggleButtonGroup>
                        <Typography sx={{color:"#D32F2F", fontSize:12, ml:2, mb:2}}>{routineDaysError}</Typography>
                        <Button onClick={validateAndAddRoutine}>Create routine</Button>
                    </Stack>
                </ModalBox>
            </div>
        </Modal>
        </>
    );
}

export default CreateRoutineModal;