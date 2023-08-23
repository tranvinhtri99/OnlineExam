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
import { QuestionContext } from "../../../contexts/QuestionContext"
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';
import { linQSelect, linQWhere, replace } from '../../../helpers/utils';
import { Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { SubjectContext } from "../../../contexts/SubjectContext"


export default function Tablequestion() {
    const {
        questionState: { question, questions, questionsLoading },
        getQuestions,
        deleteQuestion,
        showToast: { show, message, type },
        setShowToast,
        updateQuestion
    } = useContext(QuestionContext)

    const {
        subjectState: { subject, subjects, subjectsLoading },
        getSubjects,
    } = useContext(SubjectContext)

    useEffect(() => { getQuestions(); }, []);
    useEffect(() => { getSubjects(); }, []);


    const [update, setUpdate] = useState({ open: false, question: null });

    const onUpdateQuestion = async (e) => {

        const data = await updateQuestion(update.question)

        console.log(data);
        return data.type == 0;
    }

    const updateText = (text) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, question: { ...state.question, text } };
        })
    }

    const updateLevel = (level) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, question: { ...state.question, level } };
        })
    }

    const updateSubjectId = (subjectId) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, question: { ...state.question, subjectId } };
        })
    }

    const onChangeAnwserform = (name, value, index) => setUpdate(x => {
        // event.target.name.split('.').at(-1) => get the name of input after dot (.) (a.g. answer, correct)
        console.log(x);
        var answer = { ...x.question.answers[index], [name]: value };
        console.log(answer);
        
        return { ...x, question: {...x.question, answers: replace(x.question.answers, index, answer)}}
    })

    return (
        <>
            <React.Fragment>
                <Title>Question List</Title>
                {questionsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Correct Answer</TableCell>
                                <TableCell>Noise</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {questions.map((question, index) => (
                                <TableRow key={question.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{question.text}</TableCell>
                                    <TableCell>{question.level}</TableCell>
                                    <TableCell>{question.subject.name}</TableCell>
                                    <TableCell>{linQSelect(linQWhere(question.answers, x => x.correct), x => x.answer).join("|")}</TableCell>
                                    <TableCell>{linQSelect(linQWhere(question.answers, x => !x.correct), x => x.answer).join("|")}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setUpdate({ open: true, question })}>Edit</Button>
                                        <Button onClick={() => confirmDelete(() => deleteQuestion(question.id))}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>)}
            </React.Fragment>
            <PopupEdit title={"Update question"}
                open={update.open} onclose={() => setUpdate({ open: false, question: null })} onSubmit={(e) => onUpdateQuestion(e)} >
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Question' name='Question' require="true"
                        aria-describedby='title-help' value={update.question?.text} onChange={e => updateText(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="level">Vevel</InputLabel>
                        <Select
                            labelId="level"
                            name='level'
                            id="level"
                            label="level"
                            value={update.question?.level}
                            // @ts-ignore
                            onChange={e => updateLevel(e.target.value)}
                        >
                            <MenuItem value={1} >1</MenuItem>
                            <MenuItem value={2} >2</MenuItem>
                            <MenuItem value={3} >3</MenuItem>
                        </Select>
                    </FormControl>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="subjectId">Subject</InputLabel>
                        <Select
                            labelId="subjectId"
                            name='subjectId'
                            id="subjectId"
                            label="subjectId"
                            value={update.question?.subjectId}
                            // @ts-ignore
                            onChange={e => updateSubjectId(e.target.value)}
                        >
                            {subjects.map(subject => (
                                <MenuItem key={subject.id} value={subject.id} >{subject.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Form.Group>

                <Form.Group className="mb-3">
                    {update.question?.answers.map((aw, index) => (
                        <Grid item xs={13}>
                            <Grid item xs={10}>
                                <Form.Control type='answer' placeholder='Answer' name={`answer[${index}]`} require="true"
                                    aria-describedby='title-help' value={aw.answer} onChange={e => onChangeAnwserform("answer", e.target.value, index)} />
                            </Grid>
                            <Grid item xs={5}>
                                <FormControlLabel control={
                                    <Checkbox name={`answer[${index}].correct`} value={aw.correct} onChange={e => onChangeAnwserform("correct", e.target.checked, index)} checked={aw.correct} />
                                } label="correct ?" />
                            </Grid>
                        </Grid>

                    ))}
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