import React, { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import {Button, Stack} from "@mui/material";
import "../../AddDocModal";
import AddDocModal from "../../AddDocModal";
import Task from "./Task";
import {useAuth} from "../Auth/UserAuthContext";

function TaskManager() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const {user} = useAuth();

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("userID", "==", user.uid), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);
  return(
      <>
          <Stack>
              {tasks.map(task => (
                  <Task id={task.id} key={task.id} title={task.data.title} description={task.data.description} completed={task.data.completed}></Task>
              ))}
          </Stack>
        <Button onClick={() => setOpenAddModal(true)} variant={"contained"}>Add task</Button>
        {openAddModal && <AddDocModal onClose={() => {setOpenAddModal(false)}}></AddDocModal>}
      </>
  );
}

export default TaskManager;
