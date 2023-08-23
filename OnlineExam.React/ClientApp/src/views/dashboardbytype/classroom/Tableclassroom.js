import * as React from 'react';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../../../components/dashboard/Title';
import { useContext, useState, useEffect } from "react";
import { ClassroomContext } from "../../../contexts/ClassroomContext"
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';

export default function Tableclassroom() {
    const {
        classroomState: { classroom, classrooms, classroomsLoading },
        getClassrooms,
        deleteClassroom,
        showToast: { show, message, type },
        setShowToast,
        setShowUpdateClassroomModal,
        findClassroom,
        updateClassroom
    } = useContext(ClassroomContext)

    useEffect(() => { getClassrooms(); }, []);

    const chooseClassroom = classroom => {
        console.log(classroom);
        findClassroom(classroom);
        setShowUpdateClassroomModal(true);
    }

    const [update, setUpdate] = useState({ open: false, classroom: null });

    const onUpdateClassroom = async (e) => {

        const data = await updateClassroom(update.classroom)

        console.log(data);
        window.location.reload();
        return data.type == 0;
    }

    const updateName = (name) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, classroom: {...state.classroom, name } };
        })
    }

    return (
        <>
            <React.Fragment>
                <Title>Classroom List</Title>
                {classroomsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Option</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {classrooms.map((classroom, index) => (
                                <TableRow key={classroom.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{classroom.name}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setUpdate({ open: true, classroom })}>Edit</Button>
                                        <Button onClick={() => confirmDelete(() => deleteClassroom(classroom.id))}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>)}
            </React.Fragment>
            <PopupEdit title={"Update classroom"}
                open={update.open} onclose={() => setUpdate({ open: false, classroom: null })} onSubmit={(e) => onUpdateClassroom(e)} >
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Name Classroom' name='Name Classroom' require="true"
                        aria-describedby='title-help' value={update.classroom?.name} onChange={e => updateName(e.target.value)} />
                </Form.Group>
            </PopupEdit>
            <Toast show={show}
                style={{ position: 'fixed', top: '20%', right: '10px' }}
                className={`bg-${type} text-white`}
                onClose={() => setShowToast({ show: false, message: '', type: null })}
                delay={3000}
                autohide
            >
                <Toast.Body>
                    <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </>
    )
}