import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../firebase";

export const fetchRoutineCompletionSpecificMonthSnapshot = (userID, year, month, action) => {
    const q = query(collection(db, "routineCompletion"), where("userID", "==", userID), where("year", "==", year), where("month", "==", month));
    onSnapshot(q, action)
}