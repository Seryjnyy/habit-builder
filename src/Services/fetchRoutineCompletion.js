import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";

export const fetchRoutineCompletion = async (userID, date) => {
    const q = query(collection(db, "routineCompletion"), where("userID", "==", userID), where("date", "==", date));
    return await getDocs(q);
}