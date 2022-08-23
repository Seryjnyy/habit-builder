import React, {useState} from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {Autocomplete, Button, List, Modal, Stack, TextField, Typography} from "@mui/material";
import {useAuth} from "./Components/Auth/UserAuthContext";
import ModalBox from "./Components/Modal/ModalBox";

function AddDocModal({onClose}) {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [completionRequirementType, setCompletionRequirementType] = useState("null");

  let {user} = useAuth();

  const handleClick = async () => {
    console.log(name);
    console.log(description);
    console.log(completionRequirementType);

    try {
      await addDoc(collection(db, "tasks"), {
        userID: user.uid,
        name: name,
        description: description,
        completionRequirementType: completionRequirementType,
        created: Timestamp.now(),
      });
    } catch (err) {
      alert(err);
    }
  };

  const completionRequirementTypes = ["Time", "Amount"];

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
              <TextField id="outlined-basic" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)}/>
              <TextField id="outlined-basic" label="Description" variant="outlined" onChange={(e) => setDescription(e.target.value)}/>
              <Autocomplete renderInput={(params) => <TextField {...params}/>} options={completionRequirementTypes} onChange={(e, value) => {setCompletionRequirementType(value)}}/>

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
