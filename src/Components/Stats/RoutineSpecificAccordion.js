// import React from 'react';
// import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
// import {ExpandMore} from "@mui/icons-material";
// import RoutineCalendar from "./RoutineCalendar";
//
// function RoutineSpecificAccordion({routines, routineCompletion}){
//     return (
//         <Box sx={{backgroundColor:"lightBlue"}}>
//             <Typography>Routine specific:</Typography>
//             {routines.map((routine) => {
//
//                 return <Accordion
//                     key={routine.id}
//                 >
//                     <AccordionSummary
//                         expandIcon={<ExpandMore/>}
//                     >
//                         <Typography>{routine.data.name}</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <Typography>
//                             {routine.data.description}
//                         </Typography>
//                         <Typography>Calendar:</Typography>
//                         <RoutineCalendar routineID={routine.id} routineDays={routine.data.days} routineCompletion={routineCompletion}></RoutineCalendar>
//                     </AccordionDetails>
//                 </Accordion>
//             })}
//         </Box>
//     );
// }
//
// export default RoutineSpecificAccordion;