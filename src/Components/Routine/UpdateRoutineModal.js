import React, {useEffect, useState} from 'react';
import {Box, Button, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import RoutineTaskUpdate from "./RoutineTaskUpdate";

function UpdateRoutineModal({open, onClose, tasks, allTasks, routineID}){
    const [taskStates, setTaskStates] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);

    useEffect(() => {
        const taskStatesTemp = [];

        tasks.forEach(task => {
            taskStatesTemp.push({id: task.id, requirementType: task.requirementType, requirementAmount: task.requirementAmount, isNew: false, isToBeRemoved: false});
        });

        setTaskStates(taskStatesTemp);

        const availableTasksTemp = [];
        allTasks.forEach(task => {
            let isAlreadyInRoutine = false;
            taskStatesTemp.forEach(x => {
                if(x.id === task.id)
                    isAlreadyInRoutine = true;

            })
            if(!isAlreadyInRoutine)
                availableTasksTemp.push({id: task.id, requirementType: task.data.completionRequirementType, isAdded: false});
        });


        setAvailableTasks(availableTasksTemp);
    }, []);

    const updateTaskState = (taskID, isToBeRemoved, requirementAmount) => {
        // don't allow to remove the final task


            console.log((getLengthOfRemainingTasks() <= 1 + getLengthOfAddedTasks()));
        console.log(getLengthOfRemainingTasks());
        console.log(getLengthOfAddedTasks() + 1);
            // console.log(isToBeRemoved);
        if((getLengthOfRemainingTasks() + getLengthOfAddedTasks() <= 1) && isToBeRemoved){
            return;
        }

        const copyTaskStates = [...taskStates];

        const taskToUpdate = copyTaskStates.find(task => task.id === taskID);
        console.log(isToBeRemoved);
        taskToUpdate.isToBeRemoved = isToBeRemoved;
        taskToUpdate.requirementAmount = requirementAmount;

        setTaskStates([...copyTaskStates]);
    }

    const getLengthOfRemainingTasks = () => {
        return taskStates.filter(task => !task.isToBeRemoved).length;
    }

    const getLengthOfAddedTasks = () => {
        return availableTasks.filter(task => task.isAdded).length;
    }

    const updateAvailableTaskState = (taskID, isAdded, requirementAmount) => {
        if(!isAdded && (getLengthOfRemainingTasks() + getLengthOfAddedTasks() <= 1))
            return;

        const copyAvailableTasks = [...availableTasks];

        const taskToUpdate = copyAvailableTasks.find(task => task.id === taskID);
        taskToUpdate.isAdded = isAdded;
        taskToUpdate.requirementType = requirementAmount;

        setAvailableTasks([...copyAvailableTasks]);
    }

    const updateRoutine = () => {
        const finalTasks = [];
        const tasksToIncrement = [];
        const tasksToDecrement = [];

        taskStates.forEach(task => {
            if(task.isToBeRemoved){
                tasksToDecrement.push(task.id);
            }else{
                const reqAmount = task.requirementType === "Completion" ? 1 : task.requirementAmount;
                finalTasks.push({id: task.id, requirementType: task.requirementType, requirementAmount: (reqAmount ? reqAmount : 99)})
                tasksToIncrement.push(task.id);
            }
        })

        availableTasks.filter(task => task.isAdded).forEach(task => {
            const reqAmount = task.requirementType === "Completion" ? 1 : task.requirementAmount;
            finalTasks.push({id: task.id, requirementType: task.requirementType, requirementAmount: (reqAmount ? reqAmount : 99)});
            tasksToIncrement.push(task.id);
        });


        const ref = doc(db, "routine", routineID);
        console.log(finalTasks);

        setDoc(ref, {
            tasks: finalTasks
        }, {merge: true})
        onClose();
    }

    return (
        <Modal sx={{mt: 20, overflowY: "scroll"}} open={open} onClose={onClose} aria-labelledby="modal-modal-title">
            <div>
                <ModalBox>
                    <Stack>
                        <Box>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                                Update routine
                            </Typography>
                            <Typography>Remove tasks</Typography>

                            {taskStates.map(task => {
                                return <RoutineTaskUpdate id={task.id} requirementAmount={task.requirementAmount} requirementType={task.requirementType} updateTask={updateTaskState} isAdded={!task.isToBeRemoved}/>
                            })}

                        </Box>

                        <Box sx={{mt:4}}>
                            <Typography>Add tasks</Typography>
                            {availableTasks.map(task => {
                                console.log(task);

                                return <RoutineTaskUpdate id={task.id} requirementAmount={task.requirementAmount} requirementType={task.requirementType} updateTask={updateAvailableTaskState} isAdded={task.isAdded}/>
                            })}
                        </Box>

                        <Button onClick={updateRoutine}>Update</Button>
                    </Stack>
                </ModalBox>
            </div>
        </Modal>
    );
}

export default UpdateRoutineModal;