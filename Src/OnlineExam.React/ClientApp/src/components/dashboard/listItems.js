import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import QuizIcon from '@mui/icons-material/Quiz';
import SubjectIcon from '@mui/icons-material/Subject';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import { useHistory } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';


export const ItemNavBar = ({ Url, IconComponent, Text }) => {

    let history = useHistory();


    return (
        <ListItemButton onClick={() => history.push(Url)} >
            <ListItemIcon>
                <IconComponent />
            </ListItemIcon>
            <ListItemText primary={Text} />
        </ListItemButton>
    )
}

export const SubjectListItems = (
    <div>
        <ItemNavBar Url="/subject" IconComponent={AutoStoriesIcon} Text="Subjects" />
        <ItemNavBar Url="/addsubject" IconComponent={AddIcon} Text="Add subject" />
    </div>
);

export const ClassListItems = (
    <div>
        <ItemNavBar Url="/classroom" IconComponent={SchoolIcon} Text="Class" />
        <ItemNavBar Url="/addclassroom" IconComponent={AddIcon} Text="Add class" />
    </div>
);

export const AccountListItems = (
    <div>
        <ItemNavBar Url="/accountstudent" IconComponent={SupervisorAccountIcon} Text="Account student" />
        <ItemNavBar Url="/addaccountstudent" IconComponent={PersonAddIcon} Text="Add student" />
        <ItemNavBar Url="/accountlecture" IconComponent={SupervisorAccountIcon} Text="Account lecture" />
        <ItemNavBar Url="/addaccountlecture" IconComponent={PersonAddIcon} Text="Add lecture" />
    </div>
);

export const StudentListItems = (
    <div>
        <ItemNavBar Url="/accountstudentlecture" IconComponent={SupervisorAccountIcon} Text="Student" />
    </div>
);

export const QuestionListItems = (
    <div>
        <ItemNavBar Url="/question" IconComponent={SupervisorAccountIcon} Text="Question" />
        <ItemNavBar Url="/addquestion" IconComponent={PersonAddIcon} Text="Add question" />
    </div>
);

export const ExamListItems = (
    <div>
        <ItemNavBar Url="/exam" IconComponent={SupervisorAccountIcon} Text="Exam" />
        <ItemNavBar Url="/addexam" IconComponent={PersonAddIcon} Text="Add exam" />
    </div>
);