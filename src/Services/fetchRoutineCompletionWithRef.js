import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

export const fetchRoutineCompletionWithRef = async (routineID, date) => {
    const customID = "" + routineID + "" + date.getDate() + "" + date.getMonth() + "" + date.getFullYear();
    const routineRef = doc(db, "routineCompletion", customID);

    return await getDoc(routineRef);
}