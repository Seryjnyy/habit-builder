import React, {useEffect, useState} from "react";
import {Button, Snackbar, Stack, Typography} from "@mui/material";
import "../AddDocModal";
import AddDocModal from "../AddDocModal";
import Task from "./Task";
import {useAuth} from "../Auth/UserAuthContext";
import {fetchTasksSnapshot} from "../../Services/fetchTasksSnapshot";

const MAX_TASK_AMOUNT = 16;

function TaskManager(){
    const [openAddModal, setOpenAddModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        if(user.uid === undefined)
            return;

        const tagSet = new Set();

        fetchTasksSnapshot(user.uid, (querySnapshot) => {
            setTasks(
                querySnapshot.docs.map((doc) => {

                    if(doc.data()?.tags){
                        doc.data().tags.forEach(tag => {
                            tagSet.add(tag);
                        });
                    }
                    setTags(Array.from(tagSet));

                    return {
                        id: doc.id,
                        data: doc.data()
                    };
                })
            );
        })

    }, [user]);


    return (
        <>
            <Stack>
                {tasks.map(task => (
                    <Task key={task.id} task={task} availableTags={tags}></Task>
                ))}
            </Stack>
            <Button disabled={tasks.length >= MAX_TASK_AMOUNT} onClick={() => setOpenAddModal(true)}>Create task</Button>
            {(tasks.length >= MAX_TASK_AMOUNT) &&  <Typography sx={{fontSize:14, color:"orange"}}>*Sorry, can't create more tasks.</Typography>}

            <AddDocModal onClose={() => {
                setOpenAddModal(false);
            }} availableTags={tags} open={openAddModal}></AddDocModal>

        </>
    );
}

export default TaskManager;
