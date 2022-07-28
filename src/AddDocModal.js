import React from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Button, Stack, TextField } from "@mui/material";

const handleClick = async () => {
  try {
    await addDoc(collection(db, "tasks"), {
      title: "hello title",
      description: "hello description",
      completed: false,
      created: Timestamp.now(),
    });
  } catch (err) {
    alert(err);
  }
};

function AddDocModal({onClose}) {
  return (
    <>
      <Stack>
        <TextField id="outlined-basic" label="Title" variant="outlined" />
        <TextField id="outlined-basic" label="Description" variant="outlined" />
        <Button
          onClick={() => {
            handleClick().then(onClose());
          }}
        >
          Add record
        </Button>
      </Stack>
    </>
  );
}

export default AddDocModal;
