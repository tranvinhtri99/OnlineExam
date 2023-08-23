import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { QuestionListItems, ExamListItems, StudentListItems } from '../../../components/dashboard/listItems';
import Tableexam from './Tableexam';
import ListItemText from '@mui/material/ListItemText';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Title } from '@mui/icons-material';
import { Table } from 'react-bootstrap';
import { Button, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { downloadFile } from '../../../helpers/utils';


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

export default function DetailExam({ id, match }) {
    const history = useHistory();
    const examId = match.params.id;
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const detailExam = async examId => {
        try {
            const response = await axios.get(`/api/Exam/${examId}`)
            return response.data
        } catch (error) {
            return error
        }
    }

    const [exams, setExams] = useState([]);
    const [students, setstudents] = useState([]);
    const [mssv, setMssv] = useState({
        examId: parseInt(examId),
        studentId: ''
    });

    const checkTest = async examId => {
        const check = await detailExam(examId)
        if (check.type == 0) {
            setExams(check.data)
            setstudents(check.data.studentWithScores)
        }
        else {
            alert(check.error.Message)
        }
    }

    const add = async (newExam) => {
        console.log(mssv);

        try {
            const response = await axios.post(`/api/Exam/addStudent`, newExam)
            if (response.data.type == 1) {
                alert(response.data.error.Message)
            }
            window.location.reload();
        } catch (error) {
            alert("Add fail")
            window.location.reload();
        }

    }

    const remove = async (newExam) => {
        console.log(mssv);

        try {
            const response = await axios.post(`/api/Exam/removeStudent`, newExam)
            if (response.data.type == 1) {
                alert(response.data.error.Message)
            }
            window.location.reload();
        } catch (error) {
            alert("Remove fail")
            window.location.reload();
        }

    }

    useEffect(() => { checkTest(examId); }, []);
    const onChangeMssv = event => setMssv({ ...mssv, [event.target.name]: event.target.value })

    const callExport = async (url) => {
        return (await axios.get(url, { responseType: 'blob' })).data;
    }

    const exportListStudent = () => {
        downloadFile(() => callExport(`/api/Exam/export/list/${examId}`), "list student.pdf")
    }

    const exportExam = () => {
        downloadFile(() => callExport(`/api/Exam/export/examTest/${examId}`), "list exam test.pdf")
    }

    const exportList = () => {
        downloadFile(() => callExport(`/api/Exam/export/listExcel/${examId}`), "list test.pdf")
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <Divider sx={{ my: 1 }} >
                            <ListItemText primary={'Question'} />
                        </Divider>
                        {QuestionListItems}

                        <Divider sx={{ my: 1 }} >
                            <ListItemText primary={'Exam'} />
                        </Divider>
                        {ExamListItems}

                        <Divider sx={{ my: 1 }} >
                            <ListItemText primary={'Student'} />
                        </Divider>
                        {StudentListItems}
                        
                    </List>
                </Drawer>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                    <Grid container spacing={3}>

                        {/* Recent Orders */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <React.Fragment>
                                    <Typography
                                        component="h1"
                                        variant="h2"
                                        align="center"
                                        color="text.primary"
                                        gutterBottom
                                    >
                                        {exams.name}
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={6}>
                                            <TextField
                                                required
                                                id="studentId"
                                                name="studentId"
                                                label="Username"
                                                fullWidth
                                                autoComplete="studentId"
                                                variant="standard"
                                                onChange={onChangeMssv}
                                            />
                                        </Grid>
                                        <Grid item xs={1} />
                                        <Button
                                            variant="contained"
                                            onClick={() => add(mssv)}
                                            sx={{ mt: 3, ml: 1, mb: 5 }}
                                        >
                                            Add student
                                        </Button>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 3, ml: 1, mb: 5 }}
                                            onClick={() => exportListStudent()}
                                        >
                                            Export List Student
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 3, ml: 1, mb: 5 }}
                                            onClick={() => exportExam()}
                                        >
                                            Export List Test Exam
                                        </Button>
                                    </Grid>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Username</TableCell>
                                                <TableCell>Class</TableCell>
                                                <TableCell>Score</TableCell>
                                                <TableCell>Option</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {students.map((student, index) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.username}</TableCell>
                                                    <TableCell>{student.classroom.name}</TableCell>
                                                    {(student.score === null) ?
                                                        <TableCell>not yet exam</TableCell>
                                                        : <TableCell>{(student.score).toFixed(2)}</TableCell>}
                                                    <TableCell>
                                                        <Button onClick={() => {
                                                            remove({ ...mssv, studentId: student.username})
                                                        }}>
                                                            Remove student
                                                        </Button>
                                                        {/* <Button onClick={() => exportList()}>                                                     >
                                                            Export Excel
                                                        </Button> */}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </React.Fragment>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
