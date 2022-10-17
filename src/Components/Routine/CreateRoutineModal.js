import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  Modal,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ModalBox from "../Modal/ModalBox";
import AddDocModal from "../AddDocModal";
import { useAuth } from "../Auth/UserAuthContext";
import Task from "../Task/Task";
import TaskPlain from "./TaskPlain";
import RoutineTask from "./RoutineTask";
import CloseIcon from "@mui/icons-material/Close";
import { fetchTasksSnapshot } from "../../Services/fetchTasksSnapshot";
import { addRoutine } from "../../Services/addRoutine";
import CreateTask from "../CreateTask";
import { getAvailableTagsFromTasks } from "../../Services/getAvailableTagsFromTasks";
import LabelSelect from "../Task/LabelSelect";

const MAX_TASK_AMOUNT = 16;

function CreateRoutineModal({availableTags}) {
  const [openTaskCreationModal, setOpenTaskCreationModal] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [routineDays, setRoutineDays] = useState([]);
  // const [routineType, setRoutineType] = useState("");
  // const routineTypes = ["Morning routine", "Bed routine", "In-between routine"]
  const [userTasks, setUserTasks] = useState([]);
  const { user } = useAuth();

  const [routineTasksError, setRoutineTasksError] = useState("");
  const [routineDaysError, setRoutineDaysError] = useState("");

  const [routineTasks, setRoutineTasks] = useState([]);
  const [routineTasksLength, setRoutineTasksLength] = useState(0);

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

  // tags stuff
  const [tags, setTags] = useState([]);

  const addTask = useCallback((id, requirementType, requirementAmount) => {
    routineTasks.push({
      id: id,
      requirementType: requirementType,
      requirementAmount: requirementAmount,
    });

    setRoutineTasksLength(routineTasks.length);

    if (routineTasks.length <= 10) {
      if (routineTasksError != "") setRoutineTasksError("");
    }
  }, []);

  const removeTask = useCallback((id) => {
    let index = routineTasks
      .map((task) => {
        return task;
      })
      .indexOf(id);

    routineTasks.splice(index, 1);

    setRoutineTasksLength(routineTasks.length);

    if (routineTasks.length <= 0)
      setRoutineTasksError("Routine requires at least 1 task.");
  }, []);

  // fetches tasks
  useEffect(() => {
    if (user.uid === undefined) return;

    fetchTasksSnapshot(user.uid, (querySnapshot) => {
      setUserTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, [user]);

  const validateAndAddRoutine = () => {
    if (routineName.length <= 0) {
      setNameError("Routine requires a name.");
      return;
    }

    if (routineName.length > 50) return;

    if (routineDescription.length > 50) return;

    if (routineTasks.length <= 0) {
      setRoutineTasksError("Routine requires at least 1 task.");
      return;
    }

    if (routineTasks.length > 10) {
      setRoutineTasksError("Routine can't have more than 10 tasks.");
      return;
    }

    if (routineDays.length <= 0) {
      setRoutineDaysError("Routine needs at least 1 repeating day.");
      return;
    }

    setRoutineDaysError("");
    setRoutineTasksError("");

    const tagsOnly = tags.map(tag => tag.value);

    try {
      addRoutine(
        user.uid,
        routineName,
        routineDescription,
        routineTasks,
        routineDays,
        tagsOnly
      )
        .then(() => setSnackbarMessage("Routine created."))
        .catch((e) => setSnackbarMessage(e.message));

      setRoutineDays([]);
      setRoutineTasks([]);
      setTags([]);
      setRoutineTasksLength(0);
    } catch (err) {
      alert(err);
    }
    setOpenModal(false);
  };

  const setRoutineDaysProxy = (newDays) => {
    setRoutineDays(newDays);

    if (routineDaysError != "") setRoutineDaysError("");
  };

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const validateName = (val) => {
    if (val.length === 0) {
      setNameError("Routine requires a name.");
      return;
    }

    if (val.length > 50) {
      setNameError("Routine name must be less than 50 characters long.");
      return;
    }

    setRoutineName(val);
    setNameError("");
  };

  const validateDescription = (val) => {
    if (val.length > 50) {
      setDescriptionError(
        "Routine description must be less than 50 characters long."
      );
      return;
    }

    setRoutineDescription(val);
    setDescriptionError("");
  };

  const [taskListComponents, setTaskListComponents] = useState(null);

  useMemo(() => {
    setTaskListComponents(
      userTasks.map((task) => {
        return (
          <Box sx={{ mb: 1, mt: 1 }} key={task.id}>
            <RoutineTask
              id={task.id}
              name={task.data.name}
              tags={task.data?.tags}
              description={task.data.description}
              completionRequirementType={task.data.completionRequirementType}
              addTaskToRoutine={addTask}
              removeTaskFromRoutine={removeTask}
            ></RoutineTask>
          </Box>
        );
      })
    );
  }, [userTasks]);

  const getTaskCreationComponent = () => {
    if (userTasks.length >= MAX_TASK_AMOUNT)
      return (
        <Typography sx={{ fontSize: 14, color: "orange" }}>
          *Sorry, can't create more tasks.
        </Typography>
      );
    else if (openTaskCreationModal)
      return (
        <CreateTask
          availableTags={getAvailableTagsFromTasks(userTasks)}
          actionAfterSubmission={() => setOpenTaskCreationModal(false)}
          setSnackbarMessage={setSnackbarMessage}
        ></CreateTask>
      );
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Create routine</Button>
      <Modal
        sx={{ mt: 20, overflowY: "scroll" }}
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
      >
        <div>
          <ModalBox>
            <Stack>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Create a new routine
              </Typography>

              <TextField
                sx={{ mb: 1 }}
                error={nameError != ""}
                helperText={nameError}
                label={"Name"}
                onChange={(e) => {
                  validateName(e.target.value);
                }}
              ></TextField>

              <TextField
                sx={{ mb: 3 }}
                error={descriptionError != ""}
                helperText={
                  descriptionError != "" ? descriptionError : "*optional"
                }
                label={"Description"}
                onChange={(e) => {
                  validateDescription(e.target.value);
                }}
              ></TextField>

              {/*<Typography>Type</Typography>*/}
              {/*<Autocomplete renderInput={(params) => <TextField {...params}/>} options={routineTypes} onChange={(e, value) => {setRoutineType(value?.label)}}/>*/}

              <Typography>Tasks in routine : {routineTasksLength}</Typography>
              <Typography sx={{ color: "#D32F2F", fontSize: 12, ml: 2 }}>
                {routineTasksError}
              </Typography>
              <Divider></Divider>
              <List>{taskListComponents}</List>
              <Button
                disabled={userTasks.length >= MAX_TASK_AMOUNT}
                sx={{ mb: 1 }}
                onClick={() => setOpenTaskCreationModal(!openTaskCreationModal)}
              >
                Create task
              </Button>
              {getTaskCreationComponent()}
              <Divider sx={{ mb: 3 }}></Divider>

              <Typography>Repeat days</Typography>
              <ToggleButtonGroup
                sx={{ mb: 1 }}
                color={"primary"}
                value={routineDays}
                onChange={(event, newDays) => {
                  setRoutineDaysProxy(newDays);
                }}
              >
                <ToggleButton value={1}>Mon</ToggleButton>
                <ToggleButton value={2}>Tus</ToggleButton>
                <ToggleButton value={3}>Wed</ToggleButton>
                <ToggleButton value={4}>Thu</ToggleButton>
                <ToggleButton value={5}>Fri</ToggleButton>
                <ToggleButton value={6}>Sat</ToggleButton>
                <ToggleButton value={7}>Sun</ToggleButton>
              </ToggleButtonGroup>

            {/* tag stuff */}
              <LabelSelect
                value={tags}
                setValue={setTags}
                availableTags={availableTags.map((tag) => ({
                  value: tag,
                  name: tag,
                  createdNow: false,
                }))}
              />

              <Typography sx={{ color: "#D32F2F", fontSize: 12, ml: 2, mb: 2 }}>
                {routineDaysError}
              </Typography>
              <Button onClick={validateAndAddRoutine}>Create routine</Button>
            </Stack>
          </ModalBox>
        </div>
      </Modal>
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

export default CreateRoutineModal;
