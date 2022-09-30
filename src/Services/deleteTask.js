import {deleteDoc,doc} from "firebase/firestore";
import {db} from "../firebase";

export const deleteTask = async (taskID) => {
    const ref = doc(db, "tasks", taskID);

    return await deleteDoc(ref);
}