import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ExamContext } from '../contexts/ExamContext';
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Title } from '@mui/icons-material';



const theme = createTheme();


export default function CheckPoint() {


    const getPoint = async examId => {
        try {
            const response = await axios.get(`/api/Score`)
            return response.data
        } catch (error) {
            return error
        }
    }

    const [points, setPoint] = useState([]);

    const checkPoint = async () => {
        const check = await getPoint()
        if (check.type == 0) {
            // check.data.questions[0].answers.push({id:1, answer:"111", correct:false})
            setPoint(check.data)
        }
        else {
            alert(check.error.Message)
        }
    }

    useEffect(() => { checkPoint(); }, []);
    //sx={{ maxWidth: 345 }}
    return (
        <Box
            display="flex"
            justifyContent="center"
            minHeight="80vh"
        >
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1> POINT </h1>
                </div>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Exam Name</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {points.map((point, index) => (
                            <TableRow key={point.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{point.examName}</TableCell>
                                <TableCell>{point.subjectName}</TableCell>
                                <TableCell>{(point.score).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

        </Box>
    );
}