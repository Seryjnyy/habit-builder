import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Modal, Stack, TextField,
    Typography
} from "@mui/material";

function Task({name, description, completionRequirementType}) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    return (
        <>
            <Box>
                <Card sx={{mb:2}}>
                    <CardContent>
                        <Typography>Name: {name}</Typography>
                        <Typography>Description: {description}</Typography>
                        <Typography>Completion requirement type: {completionRequirementType}</Typography>
                    </CardContent>
                </Card>
            </Box>

        </>
    );
}

export default Task;