import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ExamContext } from '../contexts/ExamContext';
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Title } from '@mui/icons-material';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';
import {AccountContext} from '../contexts/AccountContext';



const theme = createTheme();


export default function Updatepasss() {
    const {
        updatePass
    } = useContext(AccountContext)
    const { authState: { user: { name, type, id } }, logoutUser }= useContext(AuthContext)
    const [newpass, setNewpass] = useState({
        password: '',
    })
    const onChangeAccountform = event => setNewpass({ ...newpass, [event.target.name]: event.target.value })
    const updatePassword = async () =>{
        console.log(id)
        console.log(newpass.password);
        const data = await updatePass( id, newpass.password)
        alert("Password has been change.")
        console.log(data);
        return data;
    }
    return (
        <Box
            display="flex"
            justifyContent="center"
            minHeight="30vh"
        >
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1> Update Password </h1>
                </div>
                <ValidationGroup>
                    <Validate name="password" required={[true, 'Please fill in this box']} regex={[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, 'Please correct the format']}>
                        <TextField
                            required
                            id="password"
                            name="password"
                            label="password"
                            placeholder="ex: Aa1234567@"
                            fullWidth
                            autoComplete="password"
                            variant="standard"
                            onChange={onChangeAccountform}
                        />
                    </Validate>
                    <AutoDisabler>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, ml: 1 }}
                            onClick={updatePassword}
                        >
                            Update Password
                        </Button>
                    </AutoDisabler>
                </ValidationGroup>
            </Paper>

        </Box>
    );
}