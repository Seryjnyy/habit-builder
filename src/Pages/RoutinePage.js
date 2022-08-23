import React from 'react';
import CreateRoutineModal from "../Components/Routine/CreateRoutineModal";
import {RoutineTasks} from "../Components/Routine/RoutineTasks";
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