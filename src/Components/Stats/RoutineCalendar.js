import React from 'react';
import {Box, Grid, Paper} from "@mui/material";

function RoutineCalendar({routineID, routineDays,routineCompletion}){
    const getExpectedDates = (rDays) => {
        if(rDays === [])
            return;
        const dateToday = new Date();
        const todayAsDayOfWeek = dateToday.getDay() === 0 ? 7 : dateToday.getDay();

        const startingDateOfThisMonth = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1).getDay();
        const endingDateOfThisMonth = new Date(dateToday.getFullYear(), dateToday.getMonth()+1, 0).getDate();

        const startingPoints = [];
        const expectedDates = []

        // create array of starting points
        rDays.forEach((routineDay) => {
            // ofset it so we can make sure we get the legit days before adding 7
            startingPoints.push((routineDay - startingDateOfThisMonth) - 7 + 1);
        })


        startingPoints.forEach(date => {
            while(date + 7 <= endingDateOfThisMonth){
                date = date + 7;
                if(date > 0)
                    expectedDates.push(date);
            }
        })

        return expectedDates;

    }

    const getBoxes = () => {
        const dateToday = new Date();
        const boxes = new Array(new Date(dateToday.getFullYear(), dateToday.getMonth()+1, 0).getDate()).fill(0);

        // set the expected days
        routineDays.forEach(day => boxes[day - 1] = 1);
        const aa = routineCompletion.filter(element => element.data.routineID === routineID);

        aa.forEach(element => {
            const dateSplit = element.data.date.split("/");
            if(element.data.completed){
                boxes[dateSplit[0] - 1] = 3;
            }else{
                boxes[dateSplit[0] - 1] = 2;
            }
        })

        // ideally not gray but like a overlay, disabled kind of thing since we haven't gotten there yet
        boxes.forEach((element, index) => {
            if(index > new Date().getDate())
                boxes[index] = 4;
        })

        // create elements before the first day to do offset, so a 1st day that is a Thur is on the Thur column
        // should add to the number, for example + 10 so we can overlay for example the expected days with gray
        let startDateAsDayOfWeek = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1).getDay();
        startDateAsDayOfWeek = startDateAsDayOfWeek === 0 ? 7 : startDateAsDayOfWeek;

        let fillerArray = [];

        for(let i = 0; i < startDateAsDayOfWeek - 1; i++)
            fillerArray.push(5)

        const boxesWithFiller = [...fillerArray, ...boxes];

        return <Grid
            container
            sx={{width:448, height: 320}}
        >
            {boxesWithFiller.map((element, index) => {
                console.log(element);
                let colour;
                switch(element){
                    case 0:
                        // for all days in month
                        colour = "black"
                        break;
                    case 1:
                        // expected days, if not overridden then not attempted nor completed
                        colour = "red"
                        break;
                    case 2:
                        // attempted
                        colour = "orange"
                        break;
                    case 3:
                        // completed
                        colour = "green"
                        break;
                    case 4:
                        // future days that haven't happened yet
                        colour = "gray"
                        break;
                    case 5:
                        // filler boxes at the start
                        // colour = "white"
                        break;
                }

                return <Grid key={index} item xs={1.714}><Paper variant={"outlined"} square sx={{backgroundColor: colour, width:64, height:64}}></Paper></Grid>;
            })}
        </Grid>
    }

    return getBoxes();
}

export default RoutineCalendar;