import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebase";

export const fetchRoutinesSnapshot = (userID, action) => {
    const q = query(collection(db, "routine"), where("userID", "==", userID));

    onSnapshot(q, (querySnapshot) => action(querySnapshot));
}