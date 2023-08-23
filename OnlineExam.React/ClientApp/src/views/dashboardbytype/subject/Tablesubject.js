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
import { SubjectContext } from "../../../contexts/SubjectContext"
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';

export default function Tablesubject() {
    const {
        subjectState: { subject, subjects, subjectsLoading },
        getSubjects,
        deleteSubject,
        showToast: { show, message, type },
        setShowToast,
        updateSubject
    } = useContext(SubjectContext)

    useEffect(() => { getSubjects(); }, []);

    const [update, setUpdate] = useState({ open: false, subject: null });

    const onUpdateSubject = async (e) => {

        const data = await updateSubject(update.subject)

        console.log(data);
        return data.type == 0;
    }

    const updateName = (name) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, subject: {...state.subject, name } };
        })
    }

    const updateCode = (code) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, subject: {...state.subject, code } };
        })
    }

    const updatenoCredit = (noCredit) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, subject: {...state.subject, noCredit } };
        })
    }

    return (
        <>
            <React.Fragment>
                <Title>Subject List</Title>
                {subjectsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>noCredit</TableCell>
                                <TableCell>Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {subjects.map((subject, index) => (
                                <TableRow key={subject.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{subject.name}</TableCell>
                                    <TableCell>{subject.noCredit}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setUpdate({ open: true, subject })}>Edit</Button>
                                        <Button onClick={() => confirmDelete(() => deleteSubject(subject.id))}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>)}
            </React.Fragment>
            <PopupEdit title={"Update subject"}
                open={update.open} onclose={() => setUpdate({ open: false, subject: null })} onSubmit={(e) => onUpdateSubject(e)} >
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Code Subject' name='Code Subject' require="true"
                        aria-describedby='title-help' value={update.subject?.code} onChange={e => updateCode(e.target.value)} disabled/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Name Subject' name='Name Subject' require="true"
                        aria-describedby='title-help' value={update.subject?.name} onChange={e => updateName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='noCredit' name='noCredit' require="true"
                        aria-describedby='title-help' value={update.subject?.noCredit} onChange={e => updatenoCredit(e.target.value)} />
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