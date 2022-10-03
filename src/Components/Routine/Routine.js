import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    LinearProgress, List, Modal,
    Paper, Stack, TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import TaskToComplete from "./TaskToComplete";
import ModalBox from "../Modal/ModalBox";
import UpdateRoutineModal from "./UpdateRoutineModal";

function Routine({id, name, description, days, activeToday, tasks, routineProgression, updateRoutineCompletion, hidden, allTasks}) {
    const [taskProgress, setTaskProgress] = useState((routineProgression?.taskProgress === undefined ? [] : routineProgression.taskProgress));
    const [completed, setCompleted] = useState(false);

    const [routineStatus, setRoutineStatus] = useState("")

    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    useEffect(() => {
        // console.log("task am    ount " + tasks.length + " finished " + tasksCompletedToday.length)
        if(completed){
            setRoutineStatus("Finished");
        }
        else if(activeToday)
            setRoutineStatus("Active");
        else
            setRoutineStatus("Not today");

    }, [completed]);

    useEffect(() => {
        console.log(allTasks);
    }, []);


    // needs to check if it has been completed already
    useEffect(() => {
        if(taskProgress.filter(element => (element.completed === true)).length === tasks.length && activeToday && tasks.length > 0 && !completed){
            // completeRoutine(id, taskProgress);
            setCompleted(true);
        }
    }, [taskProgress]);

    const updateRoutineCompletionID = (taskID, amountCompleted, routineTaskAmount) => {
        if(amountCompleted === tasks.find(x => (x.id === taskID))?.requirementAmount)
            setTaskProgress([...taskProgress, {"completed" : true}])
        updateRoutineCompletion(id, taskID, amountCompleted, routineTaskAmount, tasks.length);
    }

    return (
        <Box sx={{minWidth:{xs: "90%", sm:"90%", md:800,}, mb: 2, borderRadius: 2, mt: 2}} hidden={hidden}>
            <Paper sx={{p:2}}>

                {/*<Typography>ID: {id}</Typography>*/}
                <Typography sx={{fontSize: 24}}>{name}</Typography>
                {/*<span role="img" aria-label={"routine-image"}>*/}
                {/*    {String.fromCodePoint(0x1F609)}*/}
                {/*</span>*/}
                <Divider sx={{mb:2}}></Divider>
                {/*<Typography>Description: {description}</Typography>*/}
                {activeToday && <Typography variant={"body2"} sx={{fontSize:14}}>Tasks left: {tasks.length - taskProgress.filter(task => (task.completed === true)).length}</Typography>}
                {tasks.map((task) => {
                    // console.log(task);
                    return <TaskToComplete key={id + task.id} task={task} updateRoutineCompletion={updateRoutineCompletionID} activeToday={activeToday}
                                           alreadyCompleted={taskProgress.find(element => element.id === task.id)?.amount >= task.requirementAmount  ? true : false} amountComplete={taskProgress.find(element => element.id === task.id)?.amount}></TaskToComplete>
                })}
                <Divider></Divider>
                <ToggleButtonGroup sx={{mt:1}}disabled={true} color={"primary"} value={days}>
                    <ToggleButton value={1}>Mon</ToggleButton>
                    <ToggleButton value={2}>Tus</ToggleButton>
                    <ToggleButton value={3}>Wed</ToggleButton>
                    <ToggleButton value={4}>Thu</ToggleButton>
                    <ToggleButton value={5}>Fri</ToggleButton>
                    <ToggleButton value={6}>Sat</ToggleButton>
                    <ToggleButton value={7}>Sun</ToggleButton>
                </ToggleButtonGroup>

                <LinearProgress sx={{mt: 2}} variant="determinate" value={taskProgress.filter(task => (task.completed === true)).length != 0 ? (taskProgress.filter(task => (task.completed === true)).length / tasks.length) * 100 : 0} />
                <Typography>Status: {routineStatus}</Typography>
                <Button onClick={() => setOpenUpdateModal(true)}>Update</Button>
            </Paper>

            {/*needs to be like this because otherwise the component keeps its last state*/}
            {openUpdateModal && <UpdateRoutineModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} tasks={tasks}
                                 routineID={id} allTasks={allTasks} taskProgress={taskProgress}></UpdateRoutineModal>}
        </Box>
    );
}

export default Routine;