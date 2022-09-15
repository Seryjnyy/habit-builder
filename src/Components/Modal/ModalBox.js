import React from 'react';
import {Box} from "@mui/material";

function ModalBox({children}) {
    const style = {
        margin: "auto",
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Box sx={{...style}}>
            {children}
        </Box>
    );
}

export default ModalBox;