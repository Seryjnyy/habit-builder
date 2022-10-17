import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import LabelSelect from "./LabelSelect";

export default function UpdateTaskModal({open, onClose, description, tags, availableTags, id, setSnackbarMessage}) {
 const [taskDescription, setTaskDescription] = useState(description);
 const [taskTags, setTaskTags] = useState(tags?.map(tag => ({value: tag, name: tag, createdNow: false})));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };

    const updateTask = () => {
        // convert tags to pure form
        const finalTags = taskTags.map((tag) => tag.value);

        console.log(finalTags);
        const taskRef = doc(db, "tasks", id);
        setDoc(taskRef, {
            description: taskDescription,
            tags: finalTags
        }, {merge: true})
            .then(() => {if(setSnackbarMessage != undefined) setSnackbarMessage("Task updated.")})
            .catch((e) => {if(setSnackbarMessage != undefined) setSnackbarMessage("Failed to update task.")});

        onClose(false);
    };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={style}>
        <Stack>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Update task
          </Typography>

          <TextField
            sx={{ mb: 2 }}
            id="outlined-helperText"
            label="Description"
            value={taskDescription != undefined ? taskDescription : ""}
            onChange={(e) => {
              setTaskDescription(e.target.value);
            }}
          />
          <Box>
            {/*needs the autocomplete from addDocModal*/}
            {/*now needs to actually update the doc if there are changes*/}
            <LabelSelect
              value={taskTags != undefined ? taskTags : []}
              setValue={setTaskTags}
              availableTags={availableTags.map((tag) => ({
                value: tag,
                name: tag,
                createdNow: false,
              }))}
            />
          </Box>
        </Stack>
        <Button sx={{ mt: 4 }} onClick={updateTask}>
          Update
        </Button>
      </Box>
    </Modal>
  );
}
