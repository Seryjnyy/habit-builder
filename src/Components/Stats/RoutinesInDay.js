import React, {useState} from 'react';
import {Divider, Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";

function RoutinesInDay({routinesInDay, routines}){
    const [days, setDays] = useState(0);

    const setDaysProxy = (day) => {
        if(days === day){
            return;
        }

        setDays(day);
    };

    const displayRoutinesInTheDay = () => {
        if(days === 0)
            return <></>;

        return <>
            {routinesInDay.get(days).map(element => {
                const routineInfo = routines.find((x) => x.id === element.routineID);

                return <Paper variant={"outlined"} key={element.routineID} sx={{mb: 2, p:2}}>
                    <Typography>Name: {routineInfo.data.name}</Typography>
                    <Typography>Description: {routineInfo.data.description}</Typography>
                </Paper>;
            })}
        </>;

    };

    if(routinesInDay == undefined || routines == undefined)
        return (<div></div>);

    return (
        <Paper sx={{mb:2, p:2}}>
            <Typography variant={"h5"}>See routines on each day</Typography>
            <Divider sx={{mb:2}}/>
            <ToggleButtonGroup sx={{mb: 1}} color={"primary"} value={days}>
                <ToggleButton onClick={() => setDaysProxy(1)} value={1}>Mon</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(2)} value={2}>Tus</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(3)} value={3}>Wed</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(4)} value={4}>Thu</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(5)} value={5}>Fri</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(6)} value={6}>Sat</ToggleButton>
                <ToggleButton onClick={() => setDaysProxy(7)} value={7}>Sun</ToggleButton>
            </ToggleButtonGroup>
            {displayRoutinesInTheDay()}
        </Paper>
    );
}

export default RoutinesInDay;