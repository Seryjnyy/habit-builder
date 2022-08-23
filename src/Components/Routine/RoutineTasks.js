import {createContext, useContext, useState} from "react";

const RoutineTasksContext = createContext(null);

export function RoutineTasks({children}){
    const [tasks, setTasks] = useState([]);
    const [tasksLength, setTasksLength] = useState(0);

    const add = (id, requirementType, requirementAmount) => {
        tasks.push({"id" : id, "requirementType" : requirementType, "requirementAmount" : requirementAmount });

        setTasksLength(tasks.length);
    };

    const remove = (id) => {
        let index = tasks.map((task) => {
            return task;
        }).indexOf(id);

        tasks.splice(index, 1);

        setTasksLength(tasks.length);
    };

    return (
        <RoutineTasksContext.Provider value={{tasks, add, remove, tasksLength}}>{children}</RoutineTasksContext.Provider>
    )
}

export function useRoutineTaskContext(){
    return useContext(RoutineTasksContext);
}