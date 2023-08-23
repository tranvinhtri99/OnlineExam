import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ExamContext } from '../contexts/ExamContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Checkbox, Container, duration, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { callbackResponse, replace } from '../helpers/utils';
import { useHistory } from 'react-router-dom';
import { Button, Statistic } from 'antd';
import { PopupEdit } from '../components/popup_edit/popup_edit';
import { usePageVisibility } from 'react-page-visibility';

const { Countdown } = Statistic
const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: 20,
    width: '100%',
}));


const theme = createTheme();
let countVisi = 0;


export default function CardExam({ id, match }) {
    const history = useHistory();
    const examId = match.params.id;

    const [chooseExam, setChooseexam] = useState()
    const [timeCountDown, setTimeCountDown2] = useState(null)

    const examTest = async examId => {
        try {
            const response = await axios.get(`/api/Exam/examtest/${examId}`)
            return response.data
        } catch (error) {
            return error
        }
    }
    const [submitQuestion, setSubmitQuestion] = useState([]);

    const checkTest = async examId => {
        const check = await examTest(examId)
        if (check.type == 0) {
            setChooseexam(check.data)
            setSubmitQuestion(check.data.questions)
            setTimeCountDown2(Date.now() + parseInt(check.data.timeCountDown) * 1000)
        }
        else {
            alert(check.error.Message)
        }
    }

    useEffect(() => { checkTest(examId); }, []);

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };

    const handleAnswer = (iQuestion, iAnswer) => {
        const tempAnswers = submitQuestion[iQuestion].answers;
        const newAnswer = replace(tempAnswers, iAnswer, { ...tempAnswers[iAnswer], selected: !tempAnswers[iAnswer].selected })
        setSubmitQuestion(replace(submitQuestion, iQuestion, { ...submitQuestion[iQuestion], answers: newAnswer }))
    }

    const handleSubmitExam = async () => {
        const response = await axios.post(`/api/Exam/examSubmit/${examId}`, submitQuestion)
        callbackResponse(response.data, data => {
            alert(`Xin chúc mừng bạn đã được ${(data.point).toFixed(2)} điểm`)
        })
        history.push("/checkpoint")
    }
    const onFinish = async () => {
        const response = await axios.post(`/api/Exam/examSubmit/${examId}`, submitQuestion)
        callbackResponse(response.data, data => {
            alert(`Xin chúc mừng bạn đã được ${(data.point).toFixed(2)} điểm`)
        })
        history.push("/checkpoint")
    }

    const [checkout, setCheckout] = React.useState(false)



    const pageVisibilityStatus = usePageVisibility();
    console.log(pageVisibilityStatus);

    if (!pageVisibilityStatus && !checkout) {
        if (countVisi < 3) {
            setCheckout(true)
            countVisi++
            console.log(countVisi);
        }
        else {
            handleSubmitExam()
        }
    }
    if (chooseExam == null) {
        return (
            <Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    minHeight="10vh"
                >
                    <Div>Unable to download exam questions</Div>
                </Box>
            </Box>
        );
    }
    else {

        return (
            <Box>

                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        {chooseExam.name}
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Subject: {chooseExam.subject.name}
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        <Countdown title="Time" value={timeCountDown} onFinish={onFinish} />
                    </Typography>
                </Container>



                <List sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }} >
                    {submitQuestion.map((question, indexQuestion) => (
                        <Div>
                            <b sx={{ width: '100%' }} style={flexContainer}> Question {indexQuestion + 1}:</b> <div>{question.text} </div>
                            <ListItem>
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={flexContainer}>
                                    {question.answers.map((answer, index) => (
                                        <ListItem
                                            key={answer.id}
                                            disablePadding
                                        >
                                            <ListItemButton role={undefined} onClick={e => handleAnswer(indexQuestion, index)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={answer.selected}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': index }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={index} primary={answer.answer} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </ListItem>
                        </Div>
                    ))}
                </List>

                <Button onClick={e => handleSubmitExam()}>
                    Submit
                </Button>

                <PopupEdit title={"Warning"}
                    open={checkout} onclose={() => setCheckout(false)} onSubmit={(e) => setCheckout(false)} >
                    <strong> You use another site while taking the exam </strong>
                </PopupEdit>
            </Box>
        )
    }

}