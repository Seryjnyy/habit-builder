import {addDoc, collection, Timestamp} from "firebase/firestore";
import {db} from "../firebase";

export const addRoutine = async (userID, name, description, tasks, days) => {
    return addDoc(collection(db, "routine"), {
        userID : userID,
        name: name,
        description: description,
        tasks: tasks,
        days: days,
        created: Timestamp.now()
    })


}