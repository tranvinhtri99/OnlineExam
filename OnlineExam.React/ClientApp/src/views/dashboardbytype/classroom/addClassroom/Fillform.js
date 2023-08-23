import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { ClassroomContext } from '../../../../contexts/ClassroomContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse } from '../../../../helpers/utils';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

export default function Fillform() {
  const history = useHistory()

  const {
    classroomState: { classroom, classrooms, classroomsLoading },
    addClassroom,
  } = useContext(ClassroomContext)

  const [classroomform, setClassroomform] = useState({
    name: '',
  })

  const add = async event => {
    console.log(classroomform);

    try {
      const classroomData = await addClassroom(classroomform);
      console.log(classroomData)

      callbackResponse(classroomData, (d) => {
        history.push("/classroom")
      })
    } catch (error) {
      console.log(error)
    }

  }
  const onChangeClassroomform = event => setClassroomform({ ...classroomform, [event.target.name]: event.target.value })
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Fill in the information
      </Typography>
      <ValidationGroup>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Validate name="name" required={[true, 'Please fill in this box']}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                autoComplete="name"
                variant="standard"
                onChange={onChangeClassroomform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12} />
          <AutoDisabler>
            <Button
              variant="contained"
              onClick={add}
              sx={{ mt: 3, ml: 1 }}
            >
              Add classroom
            </Button>
          </AutoDisabler>
        </Grid>
      </ValidationGroup>
    </React.Fragment >
  );
}