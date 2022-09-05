import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase";

export const setRoutineCompletion = async (routineID, date, data) => {
    const id = "" + routineID + "" + date.getDate() + "" + date.getMonth() + "" + date.getFullYear();
    const ref = doc(db, "routineCompletion", id);

    return await setDoc(ref, data, {merge:true});
}