import React from "react";
import {Modal} from "@mui/material";
import ModalBox from "./Modal/ModalBox";

import CreateTask from "./CreateTask";

function AddDocModal({onClose, availableTags, open}){
    return (
            <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
                <div>
                    <ModalBox>
                       <CreateTask availableTags={availableTags} actionAfterSubmission={onClose}/>
                    </ModalBox>
                </div>
            </Modal>
    );
}

export default AddDocModal;
