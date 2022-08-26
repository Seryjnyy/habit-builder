import React from 'react';
import CreateRoutineModal from "../Components/Routine/CreateRoutineModal";
import Routines from "../Components/Routine/Routines";

function RoutinePage(props) {
    return (
        <>
            <Routines></Routines>
            <CreateRoutineModal></CreateRoutineModal>
        </>
    );
}

export default RoutinePage;