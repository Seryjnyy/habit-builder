import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";

export const fetchTasks = async (userID) => {
    const q = query(collection(db, "tasks"), where("userID", "==", userID));
    return await getDocs(q);
}