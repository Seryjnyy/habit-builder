import React, {useEffect, useState} from 'react';
import {Box, Button, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import RoutineTaskUpdate from "./RoutineTaskUpdate";

function UpdateRoutineModal({open, onClose, tasks, allTasks, routineID, taskProgress}){
    const [taskStates, setTaskStates] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);

    useEffect(() => {
        const taskStatesTemp = [];
        console.log(taskProgress);

        tasks.forEach(task => {
            taskStatesTemp.push({id: task.id, requirementType: task.requirementType, requirementAmount: task.requirementAmount, isToBeRemoved: false, completed: taskProgress.find(element => element.id === task.id)?.completed});
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
                availableTasksTemp.push({id: task.id, requirementType: task.data.completionRequirementType, requirementAmount: task.data.requirementAmount, isAdded: false});
        });


        setAvailableTasks(availableTasksTemp);
    }, []);

    const getLengthOfRemainingTasks = () => {
        return taskStates.filter(task => !task.isToBeRemoved).length;
    }

    const getLengthOfAddedTasks = () => {
        return availableTasks.filter(task => task.isAdded).length;
    }

    const updateAmountForAvailableTask = (taskID, amount) => {
        console.log(taskID);
        // get a copy of the task we want to update
        const copyAvailableTasks = [...availableTasks];
        const taskToUpdate = copyAvailableTasks.find(task => task.id === taskID);

        taskToUpdate.requirementAmount = amount;
        setAvailableTasks([...copyAvailableTasks]);
    }

    const updateAmountForAddedTask = (taskID, amount) => {
        // get a copy of the task we want to update
        const copyTaskStates = [...taskStates];
        const taskToUpdate = copyTaskStates.find(task => task.id === taskID);

        taskToUpdate.requirementAmount = amount;
        setTaskStates(copyTaskStates);
    }

    const updateRoutine = () => {
        const finalTasks = [];
        const tasksToDecrement = [];
        const tasksToIncrement = [];

        // go through routine tasks
        taskStates.forEach(task => {
            if(task.isToBeRemoved){
                tasksToDecrement.push(task.id);
            }else{
                finalTasks.push({id: task.id, requirementType:task.requirementType, requirementAmount: task.requirementAmount});
            }
        })

        // go through available tasks
        // only go through tasks that were added to routine
        availableTasks.filter(task => task.isAdded).forEach(task => {
            finalTasks.push({id: task.id, requirementType:task.requirementType, requirementAmount: task.requirementAmount});
            tasksToIncrement.push(task.id);
        })

        const ref = doc(db, "routine", routineID);
        console.log(finalTasks);

        setDoc(ref, {
            tasks: finalTasks
        }, {merge: true})
        onClose();
    }

    const updateExistingTask = (taskID, isToBeRemoved, requirementAmount) => {

        // if we are trying to remove a task, make sure the length of tasks in routine is more than 1
        if(isToBeRemoved && (getLengthOfRemainingTasks() + getLengthOfAddedTasks() <= 1)){
            return;
        }

        // get a copy of the task we want to update
        const copyTaskStates = [...taskStates];
        const taskToUpdate = copyTaskStates.find(task => task.id === taskID);

        // update to be removed field
        // if task requirement amount was modified then update the fields
        taskToUpdate.isToBeRemoved = isToBeRemoved;
        taskToUpdate.requirementAmount = requirementAmount;

        setTaskStates([...copyTaskStates]);
    }

    const updateAvailableTask = (taskID, isAdded, requirementAmount) => {
        // If we are trying to remove a task, make sure the length of tasks in routine is more than 1
        if(isAdded && (getLengthOfRemainingTasks() + getLengthOfAddedTasks() <= 1))
            return;

        // get a copy of the task we want to update
        const copyAvailableTasks = [...availableTasks];
        const taskToUpdate = copyAvailableTasks.find(task => task.id === taskID);

        // update the task fields
        taskToUpdate.isAdded = !isAdded;
        taskToUpdate.requirementAmount = requirementAmount;

        setAvailableTasks([...copyAvailableTasks]);
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
                            <Typography>Tasks in routine: {taskStates.filter(task => !task.isToBeRemoved).length + availableTasks.filter(task => task.isAdded).length}</Typography>
                            <Typography>Remove tasks</Typography>

                            {taskStates.map(task => {
                                console.log(task.completed);
                                return <RoutineTaskUpdate key={task.id} id={task.id} requirementAmount={task.requirementAmount} requirementType={task.requirementType} updateTask={updateExistingTask} isAdded={!task.isToBeRemoved} updateAmount={updateAmountForAddedTask} disableOptions={task.completed}/>
                            })}

                        </Box>

                        <Box sx={{mt:4}}>
                            <Typography>Add tasks</Typography>
                            {availableTasks.map(task => {
                                return <RoutineTaskUpdate key={task.id} id={task.id} requirementAmount={task.requirementAmount} requirementType={task.requirementType} updateTask={updateAvailableTask} isAdded={task.isAdded} updateAmount={updateAmountForAvailableTask} disableOptions={false}/>
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