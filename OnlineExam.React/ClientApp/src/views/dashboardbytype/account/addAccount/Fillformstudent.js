import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// @ts-ignore
import FormControlLabel from '@mui/material/FormControlLabel';
// @ts-ignore
import Checkbox from '@mui/material/Checkbox';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { AccountContext } from '../../../../contexts/AccountContext';
import { ClassroomContext } from '../../../../contexts/ClassroomContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse } from '../../../../helpers/utils';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

export default function Fillform() {
  const history = useHistory()

  const {
    // @ts-ignore
    accountState: { account, accounts, accountsLoading },
    addAccountStudent,
  } = useContext(AccountContext)

  const {
    // @ts-ignore
    classroomState: { classroom, classrooms, classroomsLoading },
    getClassrooms,
  } = useContext(ClassroomContext)

  const [accountform, setAccountform] = useState({
    username: '',
    name: '',
    password: '',
    classroomId: ''
  })

  // @ts-ignore
  const add = async event => {
    console.log(accountform);

    try {
      const accountData = await addAccountStudent(accountform);
      console.log(accountData)

      // @ts-ignore
      callbackResponse(accountData, (d) => {
        history.push("/accountstudent")
      })
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => { getClassrooms(); }, []);

  const onChangeAccountform = event => setAccountform({ ...accountform, [event.target.name]: event.target.value })
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Fill in the information
      </Typography>
      <ValidationGroup>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Validate name="username" required={[true, 'Please fill in this box']} regex={[/^[a-z0-9_-]{3,16}$/, 'Please correct the format']}>
              <TextField
                required
                id="username"
                name="username"
                label="Username"
                placeholder="ex: sparklingstar"
                fullWidth
                autoComplete="username"
                variant="standard"
                onChange={onChangeAccountform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Validate name="password" required={[true, 'Please fill in this box']} regex={[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, 'Please correct the format']}>
              <TextField
                required
                id="password"
                name="password"
                label="Password"
                placeholder="ex: Aa1234567@"
                fullWidth
                autoComplete="password"
                variant="standard"
                onChange={onChangeAccountform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12}>
            <Validate name="name" required={[true, 'Please fill in this box']} regex={[/^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/, 'Please correct the format']}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                placeholder="ex: Trần Vĩnh Trí"
                fullWidth
                autoComplete="name"
                variant="standard"
                onChange={onChangeAccountform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="classroomId">Classroom</InputLabel>
              <Select
                labelId="classroomId"
                name='classroomId'
                id="classroomId"
                label="classroom"
                // @ts-ignore
                label="Classroom"
                // @ts-ignore
                onChange={onChangeAccountform}
              >
                {classrooms.map(classroom => (
                  <MenuItem value={classroom.id}>{classroom.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} />
          <AutoDisabler>
            <Button
              variant="contained"
              onClick={add}
              sx={{ mt: 3, ml: 1 }}
            >
              Add account
            </Button>
          </AutoDisabler>
        </Grid>
      </ValidationGroup>
    </React.Fragment>
  )
}