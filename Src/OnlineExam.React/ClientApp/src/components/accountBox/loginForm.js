import React, { useContext, Fragment, useState } from "react";
import axios from 'axios';
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from 'react-router-dom'
import AlertMessage from "../layout/AlertMessage";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const { loginUser } = useContext(AuthContext);
  const history = useHistory()

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const [alert, setAlert] = useState(null)

  const login = async event => {
    console.log(loginForm);

    event.preventDefault();

    try {
      const loginData = await loginUser(loginForm);
      if (loginData.type == 0) {
        //history.push('/')
      }
      else {
        setAlert({ type: 'danger', message: loginData.error.Message })
        setTimeout(() => setAlert(null), 5000)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const { username, password } = loginForm

  const onChangeLoginForm = event => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

  return (
    <BoxContainer>
      <AlertMessage info={alert} />
      <FormContainer onSubmit={login}>
        <Input type="user" placeholder="User" name='username' required value={username} onChange={onChangeLoginForm} />
        <Input type="password" placeholder="Password" name='password' required value={password} onChange={onChangeLoginForm} />
        <Marginer direction="vertical" margin="1.6em" />
        <SubmitButton type="submit" >Signin</SubmitButton>
      </FormContainer>

      <Marginer direction="vertical" margin="1em" />
      <MutedLink>
        <BoldLink onClick={switchToSignup}>
          Don't have an account?
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}