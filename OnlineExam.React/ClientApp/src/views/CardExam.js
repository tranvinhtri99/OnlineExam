import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ExamContext } from '../contexts/ExamContext';
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Grid, Paper, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';



const theme = createTheme();

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

export default function CardExam({ id, match }) {

    const examId = match.params.id;
    console.log(examId);
    const history = useHistory();


    const {
        examState: { exam, exams, examsLoading },
        examJoin,
    } = useContext(ExamContext)


    const examTest = async examId => {
        try {
            const response = await axios.get(`/api/Exam/examtest/${examId}`)
            return response.data
        } catch (error) {
            return error
        }
    }

    const [chooseExam, setChooseexam] = useState()
    const handleClick = async (id) => {
        console.log(id);

        let data = await examTest(id)
        console.log(data);
        if (data.type != 0) {
            alert(data.error.Message);
        } else {
            setChooseexam(data)
            history.push("/doexam/" + id)
        }

    };



    useEffect(() => { examJoin(); }, []);

    if (exams[0] == null) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                align-items = "center"
                minHeight="10vh"
            >
                <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignitems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h5> There are currently no exams available </h5>
                    </div>
                </Paper>
            </Box>
        )
    }
    else {
        return (
            <div>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                            width: 345,
                            height: 200,
                        },
                    }}
                >
                    {exams.map((exam, index) => (
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {exam.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Time start: {exam.start}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Time work: {exam.time}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Question: {exam.countQuestion}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleClick(exam.id)}>Join</Button>
                            </CardActions>
                        </Card>
                    ))
                    }
                </Box>
            </div>
        );
    }
}