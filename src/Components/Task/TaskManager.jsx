import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import "../AddDocModal";
import AddDocModal from "../AddDocModal";
import Task from "./Task";
import { useAuth } from "../Auth/UserAuthContext";
import { fetchTasksSnapshot } from "../../Services/fetchTasksSnapshot";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import TagFilter from "./TagFilter";
import { useAllData } from "../../AllData";

const MAX_TASK_AMOUNT = 16;

function TaskManager() {
  const { user } = useAuth();
  const {tasksData, requestTasksData} = useAllData();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksRender, setTasksRender] = useState([]);

  useEffect(() => {
    if(tasksData != null){
      let tempTasks = tasksData.map(task => ({...task, filterMatch: 0}));
      setTasks(tempTasks);
      setTasksRender(tempTasks);
    }
  

  }, [tasksData]);

    // filter stuff
    const [availableTags, setAvailableTags] = useState([]);


  useEffect(() => {
    const tagSet = new Set();

    tasks.forEach(task => {
      task.tags.forEach(tag => {
        tagSet.add(tag);
      });
    });

    // If tag is already in available tags, then don't change 

    setAvailableTags(Array.from(tagSet).map(tag => {
      let found = availableTags.find(element => tag === element.name)?.selected;
      let selected = found == undefined ? false : found;


      return {name:tag, selected:selected}
    }));
  }, [tasks])
  


  // snackbar things
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleCloseSnackbar = () => {
    setSnackbarMessage("");
  };
  const snackbarAction = (
    <>
      {/*<Button size={"small"} onClick={handleCloseSnackbar}>reload it</Button>*/}
      <IconButton size={"small"} onClick={handleCloseSnackbar}>
        <CloseIcon fontSize={"small"}></CloseIcon>
      </IconButton>
    </>
  );



  useEffect(() => {
    if (user.uid === undefined) return;

    requestTasksData(user.uid);
  }, [user]);

  useEffect(() => {
    // check which tags are set
    // increment filterMatch for each task for each tag
    // TODO : WTF THIS IS RETARDED
    const tasksTemp = JSON.parse(JSON.stringify(tasks));

    tasksTemp?.forEach(task => {
      let tagsMatched = 0;
      availableTags?.forEach(tag => {
        if(!tag.selected) return;

        task.data.tags?.forEach(taskTag => {
          if(taskTag === tag.name)
            tagsMatched++;
        })
      })
      task.filterMatch = tagsMatched;
    })


    setTasksRender([...tasksTemp]);
  }, [availableTags]);

  // idk if this needs to happen each re-render
  const doSomething = (sorted) => {
    let appliedTagsAmount = availableTags.filter(tag => tag.selected).length;

    const arr = [];
    
    let previousMatchedFilter = true;
    let noMatches = false;
    sorted.forEach((task, index) => {
      if(index === 0 && task.filterMatch < appliedTagsAmount){
        arr.push(<Typography>Nothing found with these exact tags</Typography>);
        arr.push(<Divider sx={{mt:1, mb:1}}/>)
        noMatches = true;
      }else if(previousMatchedFilter && task.filterMatch < appliedTagsAmount && !noMatches){
        arr.push(<Divider sx={{mt:1, mb:1}}/>)
        previousMatchedFilter = false;
      }

      arr.push(<Task
        key={task.id}
        task={task}
        availableTags={availableTags.map(tag => (tag.name))}
        setSnackbarMessage={setSnackbarMessage}
      ></Task>);
    });

    return arr;
  }
  return (
    <>
      <Button
        disabled={tasks.length >= MAX_TASK_AMOUNT}
        onClick={() => setOpenAddModal(true)}
      >
        Create task
      </Button>
      {tasks.length >= MAX_TASK_AMOUNT && (
        <Typography sx={{ fontSize: 14, color: "orange" }}>
          *Sorry, can't create more tasks.
        </Typography>
      )}

      <Stack>
        <Box>
          <Typography>Filter by tags</Typography>
          <TagFilter
            availableTags={availableTags}
            setAvailableTags={setAvailableTags}
          ></TagFilter>
        </Box>
        {
          doSomething(tasksRender.sort((a, b) => b.filterMatch - a.filterMatch))
        }
      </Stack>

      <AddDocModal
        onClose={() => {
          setOpenAddModal(false);
        }}
        availableTags={availableTags.map(tag => (tag.name))}
        open={openAddModal}
        setSnackbarMessage={setSnackbarMessage}
      ></AddDocModal>

      <Snackbar
        open={snackbarMessage != ""}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={snackbarAction}
      ></Snackbar>
    </>
  );
}

export default TaskManager;
