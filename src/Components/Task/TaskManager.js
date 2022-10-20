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

const MAX_TASK_AMOUNT = 16;

function TaskManager() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);

  const { user } = useAuth();

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

  // filter stuff
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (user.uid === undefined) return;

    const tagSet = new Set();

    fetchTasksSnapshot(user.uid, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => {
          if (doc.data()?.tags) {
            doc.data().tags.forEach((tag) => {
              tagSet.add(tag);
            });
          }
          setTags(Array.from(tagSet));

          // for tag filter
          const availableTagsArray = [];
          tagSet.forEach((tag) =>
            availableTagsArray.push({ name: tag, selected: false })
          );
          setAvailableTags(availableTagsArray);

          return {
            id: doc.id,
            data: { ...doc.data(), filterMatch: 0 },
          };
        })
      );
    });
  }, [user]);

  useEffect(() => {
    // check which tags are set
    // increment filterMatch for each task for each tag
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
      task.data.filterMatch = tagsMatched;
    })

    setTasks([...tasksTemp]);
    console.log(availableTags.length);
    console.log(tasksTemp);
  }, [availableTags]);

  // idk if this needs to happen each re-render
  const doSomething = (sorted) => {
    let appliedTagsAmount = availableTags.filter(tag => tag.selected).length;

    const arr = [];
    
    let previousMatchedFilter = true;
    let noMatches = false;
    sorted.forEach((task, index) => {
      if(index === 0 && task.data.filterMatch < appliedTagsAmount){
        arr.push(<Typography>Nothing found with these exact tags</Typography>);
        arr.push(<Divider sx={{mt:1, mb:1}}/>)
        noMatches = true;
      }else if(previousMatchedFilter && task.data.filterMatch < appliedTagsAmount && !noMatches){
        arr.push(<Divider sx={{mt:1, mb:1}}/>)
        previousMatchedFilter = false;
      }

      arr.push(<Task
        key={task.id}
        task={task}
        availableTags={tags}
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
          doSomething(tasks.sort((a, b) => b.data.filterMatch - a.data.filterMatch))
        }
      </Stack>

      <AddDocModal
        onClose={() => {
          setOpenAddModal(false);
        }}
        availableTags={tags}
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
