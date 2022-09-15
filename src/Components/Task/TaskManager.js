import React, {useEffect, useState} from "react";
import {db} from "../../firebase.js";
import {collection, query, orderBy, onSnapshot, where} from "firebase/firestore";
import {Button, Stack} from "@mui/material";
import "../AddDocModal";
import AddDocModal from "../AddDocModal";
import Task from "./Task";
import {useAuth} from "../Auth/UserAuthContext";

function TaskManager(){
    const [openAddModal, setOpenAddModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        if(user.uid === undefined)
            return;

        const tagSet = new Set();

        const q = query(collection(db, "tasks"), where("userID", "==", user.uid), orderBy("created", "desc"));
        onSnapshot(q, (querySnapshot) => {
            setTasks(
                querySnapshot.docs.map((doc) => {


                    if(doc.data()?.tags){
                        doc.data().tags.forEach(tag => {
                            tagSet.add(tag);
                        });
                    }
                    setTags(Array.from(tagSet));
                    console.log(Array.from(tagSet));

                    return {
                        id: doc.id,
                        data: doc.data()
                    };
                })
            );
        });
    }, [user]);
    return (
        <>
            <Stack>
                {tasks.map(task => (
                    <Task id={task.id} key={task.id} name={task.data.name} description={task.data.description} tags={task.data.tags} availableTags={tags}
                          completionRequirementType={task.data.completionRequirementType}></Task>
                ))}
            </Stack>
            <Button onClick={() => setOpenAddModal(true)} variant={"contained"}>Add task</Button>
            {openAddModal && <AddDocModal onClose={() => {
                setOpenAddModal(false);
            }} availableTags={tags}></AddDocModal>}
        </>
    );
}

export default TaskManager;
