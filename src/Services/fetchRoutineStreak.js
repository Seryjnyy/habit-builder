import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

export const fetchRoutineStreak = async (routineID) => {
    const ref = doc(db, "routineStreak", routineID);

    return await getDoc(ref);
}