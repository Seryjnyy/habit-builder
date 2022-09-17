import React from 'react';
import {addDoc, collection, Timestamp} from "firebase/firestore";
import {db} from "../firebase";

export const addTask = async (userID, name, description, completionRequirementType, created, tags) => {
    return await addDoc(collection(db, "tasks"), {
        userID: userID,
        name: name,
        description: description,
        completionRequirementType: completionRequirementType,
        created: created,
        tags: tags
    })
}
