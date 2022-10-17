import {addDoc, collection, Timestamp} from "firebase/firestore";
import {db} from "../firebase";

export const addRoutine = async (userID, name, description, tasks, days, tags) => {
    return addDoc(collection(db, "routine"), {
        userID : userID,
        name: name,
        description: description,
        tasks: tasks,
        days: days,
        tags: tags,
        created: Timestamp.now()
    })


}