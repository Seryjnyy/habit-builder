import React, {useEffect, useState} from "react";
import {Button, Chip, IconButton, Snackbar, Stack, Typography} from "@mui/material";
import "../AddDocModal";
import AddDocModal from "../AddDocModal";
import Task from "./Task";
import {useAuth} from "../Auth/UserAuthContext";
import {fetchTasksSnapshot} from "../../Services/fetchTasksSnapshot";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";

const MAX_TASK_AMOUNT = 16;

function TaskManager(){
    const [openAddModal, setOpenAddModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const {user} = useAuth();

    // snackbar things
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
                    console.log("this here happens cuh");

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
            <Button disabled={tasks.length >= MAX_TASK_AMOUNT} onClick={() => setOpenAddModal(true)}>Create task</Button>
            {(tasks.length >= MAX_TASK_AMOUNT) &&  <Typography sx={{fontSize:14, color:"orange"}}>*Sorry, can't create more tasks.</Typography>}

            <Stack>
                <Box>
                    <Typography>Filter by tags</Typography>
                    {tags && tags.map((tag, index) => (<Chip key={tag + index} label={tag} sx={{mr: 1}}></Chip>))}
                </Box>
                {tasks.map(task => (
                    <Task key={task.id} task={task} availableTags={tags} setSnackbarMessage={setSnackbarMessage}></Task>
                ))}
            </Stack>

            <AddDocModal onClose={() => {
                setOpenAddModal(false);
            }} availableTags={tags} open={openAddModal} setSnackbarMessage={setSnackbarMessage}></AddDocModal>

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

export default TaskManager;
