import React, {useState} from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {Autocomplete, Button, List, Modal, Stack, TextField, Typography} from "@mui/material";
import {useAuth} from "./Components/Auth/UserAuthContext";
import ModalBox from "./Components/Modal/ModalBox";

function AddDocModal({onClose}) {
  const [openModal, setOpenModal] = useState(false);
  let {user} = useAuth();

  const handleClick = async () => {

    try {
      await addDoc(collection(db, "tasks"), {
        userID: user.uid,
        title: "hello title",
        description: "hello description",
        completed: false,
        created: Timestamp.now(),
      });
    } catch (err) {
      alert(err);
    }
  };


  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Create task</Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="modal-modal-title">
        <div>
          <ModalBox>
            <Stack>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                Create a new task
              </Typography>
              <TextField id="outlined-basic" label="Title" variant="outlined" />
              <TextField id="outlined-basic" label="Description" variant="outlined" />
              <Button
                  onClick={() => {
                    handleClick();
                  }}
              >
                Add record
              </Button>
            </Stack>
          </ModalBox>
        </div>
      </Modal>
    </>
  );
}

export default AddDocModal;
