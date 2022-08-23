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
    const [openModal, setOpenModal] = useState(false);
    const [routineName, setRoutineName] = useState("");
    const [routineDescription, setRoutineDescription] = useState("");
    const [routineDays, setRoutineDays] = useState([]);
    // const [routineType, setRoutineType] = useState("");
    // const routineTypes = ["Morning routine", "Bed routine", "In-between routine"]
    const [userTasks, setUserTasks] = useState([]);
    const {user} = useAuth();


    const [routineTasks, setRoutineTasks] = useState([]);
    const [routineTasksLength, setRoutineTasksLength] = useState(0);

    const addTask = (id, requirementType, requirementAmount) => {
        routineTasks.push({"id" : id, "requirementType" : requirementType, "requirementAmount" : requirementAmount });

        setRoutineTasksLength(routineTasks.length);
    };

    const removeTask = (id) => {
        let index = routineTasks.map((task) => {
            return task;
        }).indexOf(id);

        routineTasks.splice(index, 1);

        setRoutineTasksLength(routineTasks.length);
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

    const addRoutine = () => {
        console.log(routineName);
        console.log(routineDescription);
        console.log(routineTasks);
        console.log(routineDays);

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


                        <Typography>Description</Typography>
                        <TextField onChange={(e) => {setRoutineDescription(e.target.value)}}></TextField>

                        {/*<Typography>Type</Typography>*/}
                        {/*<Autocomplete renderInput={(params) => <TextField {...params}/>} options={routineTypes} onChange={(e, value) => {setRoutineType(value?.label)}}/>*/}

                        <Typography>Tasks in routine : {routineTasksLength}</Typography>
                        <List>
                            {userTasks.map(task => (
                                <Box sx={{mb:2}} key={task.id}>
                                    <RoutineTask id={task.id} name={task.data.name} description={task.data.description} completionRequirementType={task.data.completionRequirementType} addTaskToRoutine={addTask} removeTaskFromRoutine={removeTask}></RoutineTask>
                                    <Divider></Divider>
                                </Box>

                            ))}
                        </List>

                        <Typography>Repeat days</Typography>
                        <ToggleButtonGroup color={"primary"} value={routineDays} onChange={(event, newDays) => {setRoutineDays(newDays)}}>
                            <ToggleButton value={1}>Mon</ToggleButton>
                            <ToggleButton value={2}>Tus</ToggleButton>
                            <ToggleButton value={3}>Wed</ToggleButton>
                            <ToggleButton value={4}>Thu</ToggleButton>
                            <ToggleButton value={5}>Fri</ToggleButton>
                            <ToggleButton value={6}>Sat</ToggleButton>
                            <ToggleButton value={7}>Sun</ToggleButton>
                        </ToggleButtonGroup>
                        <Button onClick={addRoutine}>Create routine</Button>
                    </Stack>
                </ModalBox>
            </div>
        </Modal>
        </>
    );
}

export default CreateRoutineModal;