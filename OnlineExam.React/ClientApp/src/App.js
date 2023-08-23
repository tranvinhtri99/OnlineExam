import React, { Component } from 'react';
//import { Route, Router } from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './views/Login';
import { Home } from './views/Home';
import { AccountBox } from './components/accountBox'
import { Dashboard } from './views/dashboardbytype/DashboardIndex';
import DashboardSubject from './views/dashboardbytype/subject/Dashboard'
import DashboardClassroom from './views/dashboardbytype/classroom/Dashboard'
import DashboardAccountStudent from './views/dashboardbytype/account/Dashboardstudent'
import DashboardAccountStudentLecture from './views/dashboardbytype/account/DashboardstudentLecture'
import DashboardAccountLecture from './views/dashboardbytype/account/Dashboardlecture'
import AddSubject from './views/dashboardbytype/subject/addSubject/AddSubject'
import AddClassroom from './views/dashboardbytype/classroom/addClassroom/AddClassroom'
import AddStudent from './views/dashboardbytype/account/addAccount/AddStudent'
import AddLecture from './views/dashboardbytype/account/addAccount/AddLecture'
import './custom.css'
import ProtectedRoute from './components/routing/ProtectedRoute';
import { GlobalContextProvider } from './contexts/GlobalContext';
import DashboardQuestion from './views/dashboardbytype/question/Dashboard';
import AddQuestion from './views/dashboardbytype/question/addQuestion/AddQuestion';
import DashboardExam from './views/dashboardbytype/exam/Dashboard';
import AddExam from './views/dashboardbytype/exam/addExam/AddExam';
import CardExam from './views/CardExam'
import DoExam from './views/DoExam'
import Updatepass from './views/Updatepass'
import CheckPoint from './views/CheckPoint'
import DetailExam from './views/dashboardbytype/exam/DetailExam'
export function App() {

  return (
    <GlobalContextProvider>
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <ProtectedRoute exact path={['/home', '/']} component={Home} />
          <ProtectedRoute exact path='/dashboard' component={Dashboard} />
          <ProtectedRoute exact path='/subject' component={DashboardSubject} />
          <ProtectedRoute exact path='/addsubject' component={AddSubject} />
          <ProtectedRoute exact path='/question' component={DashboardQuestion} />
          <ProtectedRoute exact path='/addquestion' component={AddQuestion} />
          <ProtectedRoute exact path='/classroom' component={DashboardClassroom} />
          <ProtectedRoute exact path='/addclassroom' component={AddClassroom} />
          <ProtectedRoute exact path='/accountstudent' component={DashboardAccountStudent} />
          <ProtectedRoute exact path='/accountstudentlecture' component={DashboardAccountStudentLecture} />
          <ProtectedRoute exact path='/addaccountstudent' component={AddStudent} />
          <ProtectedRoute exact path='/accountlecture' component={DashboardAccountLecture} />
          <ProtectedRoute exact path='/addaccountlecture' component={AddLecture} />
          <ProtectedRoute exact path='/exam' component={DashboardExam} />
          <ProtectedRoute exact path='/addexam' component={AddExam} />
          <ProtectedRoute exact path='/exam' component={DashboardExam} />
          <ProtectedRoute exact path='/doexam/:id' component={DoExam} />
          <ProtectedRoute exact path='/cardexam' component={CardExam} />
          <ProtectedRoute exact path='/checkpoint' component={CheckPoint} />
          <ProtectedRoute exact path='/updatepass' component={Updatepass} />
          <ProtectedRoute exact path='/detailexam/:id' component={DetailExam} />
        </Switch>
      </Router>
    </GlobalContextProvider>
  );

}
