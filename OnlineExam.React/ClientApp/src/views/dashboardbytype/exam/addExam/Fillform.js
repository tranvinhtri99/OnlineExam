import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { ExamContext } from '../../../../contexts/ExamContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse, removeLastItem, replace } from '../../../../helpers/utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { ClassroomContext } from '../../../../contexts/ClassroomContext';
import { SubjectContext } from '../../../../contexts/SubjectContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

export default function Fillform() {
  const history = useHistory()

  const {
    examState: { exam, exams, examsLoading },
    addExam,
  } = useContext(ExamContext)

  const {
    // @ts-ignore
    classroomState: { classroom, classrooms, classroomsLoading },
    getClassrooms,
  } = useContext(ClassroomContext)

  const {
    // @ts-ignore
    subjectState: { subject, subjects, subjectsLoading },
    getSubjects,
  } = useContext(SubjectContext)

  const countExam = () => ({ key: "", value: "" });
  const [startTime, setStartTime] = useState(dayjs());

  const [examform, setExamform] = useState({
    name: '',
    start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
    time: '',
    subjectId: '',
    classroomsId: [],
    levelQuestions: [
      countExam(),
    ]
  })

  const add = async _ => {
    console.log(examform);

    try {
      const examData = await addExam(examform);
      console.log(examData)

      callbackResponse(examData, (_) => {
        history.push("/exam")
      })
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => { getSubjects(); }, []);
  useEffect(() => { getClassrooms(); }, []);
  const onChangeExamform = event => setExamform({ ...examform, [event.target.name]: event.target.value })

  const addLevel = () => setExamform({ ...examform, levelQuestions: [...examform.levelQuestions, countExam()] })
  const removeLevel = () => setExamform({ ...examform, levelQuestions: removeLastItem(examform.levelQuestions) })

  const onChangeLevelQuestionform = (name, value, index) => setExamform(x => {
    // event.target.name.split('.').at(-1) => get the name of input after dot (.) (a.g. answer, correct)
    var answer = { ...x.levelQuestions[index], [name]: value };

    return { ...x, levelQuestions: replace(x.levelQuestions, index, answer) }
  })

  const onStartTimeChange = (value, _) => {
    console.log({ value });
    debugger;
    setStartTime(value);
    setExamform({ ...examform, start: value.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' });
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Fill in the information
      </Typography>
      <ValidationGroup>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Validate name="name" required={[true, 'Please fill in this box']}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                autoComplete="name"
                variant="standard"
                onChange={onChangeExamform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                id="start"
                name="start"
                label="DateTimePicker"
                value={startTime}
                onChange={onStartTimeChange}
                minDateTime={dayjs()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Validate name="time" required={[true, 'Please fill in this box']} regex={[/[1-9][0-9]*/, 'Please correct the format']}>
              <TextField
                required
                id="time"
                name="time"
                label="Time"
                placeholder="ex: 10"
                fullWidth
                autoComplete="time"
                variant="standard"
                onChange={onChangeExamform}
              />
            </Validate>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 1100 }}>
              <InputLabel id="classroomId">Classroom</InputLabel>
              <Select
                labelId="classroomsId"
                name='classroomsId'
                id="classroomsId"
                label="classroom"
                // @ts-ignore
                value={examform.classroomsId}
                onChange={onChangeExamform}
                multiple={true}
              >
                {classrooms.map(classroom => (
                  <MenuItem key={classroom.id} value={classroom.id}>{classroom.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 1100 }}>
              <InputLabel id="subjectId">Subject</InputLabel>
              <Select
                labelId="subjectId"
                name='subjectId'
                id="subjectId"
                label="subject"
                value={examform.subjectId}
                // @ts-ignore
                onChange={onChangeExamform}
              >
                {subjects.map(subject => (
                  <MenuItem value={subject.id}>{subject.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {examform.levelQuestions.map((key, index) => (
            <Grid item xs={3} >
              <Grid item xs={10}>
                <FormControl sx={{ minWidth: 170 }}>
                  <InputLabel id="subjectId">Level</InputLabel>
                  <Select
                    required
                    id="key"
                    name={`levelQuestions[${index}].key`}
                    label="level"
                    fullWidth
                    autoComplete="level"
                    value={key.key}
                    variant="standard"
                    onChange={e => onChangeLevelQuestionform("key", e.target.value, index)}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Validate name="count" required={[true, 'Please fill in this box']} regex={[/[1-9][0-9]*/, 'Please correct the format']}>
                  <TextField
                    required
                    id="value"
                    name={`levelQuestions[${index}].value`}
                    label="Count"
                    placeholder="ex: 3"
                    fullWidth
                    autoComplete="value"
                    value={key.value}
                    variant="standard"
                    onChange={e => onChangeLevelQuestionform("value", e.target.value, index)}
                  />
                </Validate>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12} />
          <Button onClick={() => addLevel()}>
            Add level
          </Button>

          <Button onClick={() => removeLevel()} >
            Remove level
          </Button>


          <Grid item xs={12} />
          <AutoDisabler>
            <Button
              variant="contained"
              onClick={() => add()}
              sx={{ mt: 3, ml: 1 }}
            >
              Add exam
            </Button>
          </AutoDisabler>
        </Grid>
      </ValidationGroup>
    </React.Fragment>
  );
}