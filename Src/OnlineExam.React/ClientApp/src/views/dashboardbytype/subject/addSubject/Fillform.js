import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { SubjectContext } from '../../../../contexts/SubjectContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse } from '../../../../helpers/utils';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

export default function Fillform() {
  const history = useHistory()

  const {
    subjectState: { subject, subjects, subjectsLoading },
    addSubject,
    getSubjects
  } = useContext(SubjectContext)

  useEffect(() => { getSubjects(); }, []);

  const [subjectform, setSubjectform] = useState({
    code: subjects.length + 1,
    name: '',
    noCredit: '',
  })

  const add = async event => {
    console.log(subjectform);

    try {
      const subjectData = await addSubject(subjectform);
      console.log(subjectData)

      callbackResponse(subjectData, (d) => {
        history.push("/subject")
      })
    } catch (error) {
      console.log(error)
    }

  }

  const onChangeSubjectform = event => setSubjectform({ ...subjectform, [event.target.name]: event.target.value })
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Fill in the information
      </Typography>
      <ValidationGroup>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6}>
            <Validate name="code" required={[true, 'Please fill in this box']} regex={[/[0-9]$/, 'Please correct the format']}>
              <TextField
                required
                id="code"
                name="code"
                label="Code"
                fullWidth
                autoComplete="code"
                variant="standard"
                onChange={onChangeSubjectform}
              />
            </Validate>
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              required
              id="name"
              name="name"
              label="Name"
              fullWidth
              autoComplete="name"
              variant="standard"
              onChange={onChangeSubjectform}
            />
          </Grid>
          <Grid item xs={12}>
            <Validate name="noCredit" required={[true, 'Please fill in this box']} regex={[/^[0-9]{1,2}$/, 'Please correct the format']}>
              <TextField
                required
                id="noCredit"
                name="noCredit"
                label="noCredit"
                placeholder="ex: 1-8"
                fullWidth
                autoComplete="noCredit"
                variant="standard"
                onChange={onChangeSubjectform}
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
              Add subject
            </Button>
          </AutoDisabler>
        </Grid>
      </ValidationGroup>
    </React.Fragment>
  );
}