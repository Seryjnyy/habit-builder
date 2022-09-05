import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase";

export const setRoutineStreak = async (routineID, data) => {
    const ref = doc(db, "routineStreak", routineID);

    return await setDoc(ref, data, {merge:true});
}