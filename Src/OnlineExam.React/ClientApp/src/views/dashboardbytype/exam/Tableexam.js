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
import { ExamContext } from "../../../contexts/ExamContext"
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';
import { SubjectContext } from '../../../contexts/SubjectContext';
import { useHistory } from 'react-router-dom';

export default function Tableexam() {
    const {
        examState: { exam, exams, examsLoading },
        getExams,
        deleteExam,
        showToast: { show, message, type },
        setShowToast,
        updateExam
    } = useContext(ExamContext)

    const history = useHistory();
    useEffect(() => { getExams(); }, []);
    console.log(exams);
    const [update, setUpdate] = useState({ open: false, exam: null });

    const onUpdateExam = async (e) => {

        const data = await updateExam(update.exam)

        console.log(data);
        return data.type == 0;
    }

    const updateName = (name) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, exam: { ...state.exam, name } };
        })
    }

    const updateCode = (code) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, exam: { ...state.exam, code } };
        })
    }

    const updatenoCredit = (noCredit) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, exam: { ...state.exam, noCredit } };
        })
    }
    const transform = (id) => {
        history.push('/detailexam/' + id)
    }

    return (
        <>
            <React.Fragment>
                <Title>Exam List</Title>
                {examsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Time Start</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Count Question</TableCell>
                                <TableCell>Count Students</TableCell>
                                <TableCell>Count Score</TableCell>
                                <TableCell>Option</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {exams.map((exam, index) => (
                                <TableRow key={exam.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{exam.name}</TableCell>
                                    <TableCell>{exam.start}</TableCell>
                                    <TableCell>{exam.time}</TableCell>
                                    <TableCell>{exam.subject.name}</TableCell>
                                    <TableCell>{exam.countQuestion}</TableCell>
                                    <TableCell>{exam.countStudents}</TableCell>
                                    <TableCell>{exam.countScores}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => transform(exam.id)}>Detail</Button>
                                        <Button onClick={() => confirmDelete(() => deleteExam(exam.id))}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>)}
            </React.Fragment>
            <PopupEdit title={"Update exam"}
                open={update.open} onclose={() => setUpdate({ open: false, exam: null })} onSubmit={(e) => onUpdateExam(e)} >
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Code Exam' name='Code Exam' require="true"
                        aria-describedby='title-help' value={update.exam?.code} onChange={e => updateCode(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Name Exam' name='Name Exam' require="true"
                        aria-describedby='title-help' value={update.exam?.name} onChange={e => updateName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='noCredit' name='noCredit' require="true"
                        aria-describedby='title-help' value={update.exam?.noCredit} onChange={e => updatenoCredit(e.target.value)} />
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