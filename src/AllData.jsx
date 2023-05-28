import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchTasksSnapshot } from './Services/fetchTasksSnapshot';
import { useAuth } from './Components/Auth/UserAuthContext';
import { getRedirectResult } from 'firebase/auth';

const AllDataContext = createContext(null);

export function AllData({ children }) {
    const [tasksData, setTasksData] = useState(null);

    useEffect(() => {
      console.log("the tasks " + tasksData?.length);
    
    }, [tasksData])
    

    const requestTasksData = (userID,) => {
        if (userID === undefined) return;

        if (tasksData == null) {

            fetchTasksSnapshot(userID, (querySnapshot) => {
                let tagSet = new Set(); // TODO : this might have weird effects, it might need to be lower down
                let taskList = [];

                
                querySnapshot.docs.map((doc) => {
                    if (doc.data()?.tags) {
                        doc.data().tags.forEach((tag) => {
                            tagSet.add(tag);
                        });
                    }

                    var result = {
                        id: doc.id,
                        data: { ...doc.data() },
                        tags: Array.from(tagSet)
                    };

                    taskList.push(result);
                })

                setTasksData(taskList);
                console.log("AllDataProvider::Tasks::refetching_snapshot");


            });
        }
    }

    return (
        <AllDataContext.Provider value={{ tasksData, requestTasksData }}>{children}</AllDataContext.Provider>
    );
}

export function useAllData() {
    return useContext(AllDataContext);
}


