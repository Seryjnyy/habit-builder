import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebase";

export const fetchTasksSnapshot = (userID, action) => {
    const q = query(collection(db, "tasks"), where("userID", "==", userID), orderBy("created", "desc"));
    onSnapshot(q, action);
}