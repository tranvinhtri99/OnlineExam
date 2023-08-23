import { Box, Button, Modal, Typography } from "@mui/material"
import React from "react"
import Form from 'react-bootstrap/Form'

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

export const PopupEdit = ({ children, onSubmit, title, onclose, open, ...props }) => {

    let {autoClose} = props;
    if (!autoClose) {
        autoClose = true;
    }

    return (
        <Modal
            open={open}
            onClose={onclose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Form onSubmit={e => handleCloseFormSubmit(e, onSubmit, onclose)}>
                    {children}

                    <div>
                        <Button variant='secondary' onClick={onclose}>Cancel</Button>
                        <Button variant='primary' type='submit'>Comfirm</Button>
                    </div>
                </Form>
            </Box>
        </Modal>
    )
}

const handleCloseFormSubmit = (event, onSubmit, onClose) => {
    event.preventDefault();

    Promise.resolve(onSubmit(event)).then(value => {
        if (value)
            onClose();
    })

}
