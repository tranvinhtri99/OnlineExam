import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { QuestionContext } from '../../../../contexts/QuestionContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse, removeLastItem, replace } from '../../../../helpers/utils';
import * as XLSX from "xlsx";
import { Box, Collapse, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SubjectContext } from '../../../../contexts/SubjectContext';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

function Fillform() {
  const history = useHistory()

  const {
    questionState: { question, questions, questionsLoading },
    addQuestion,
  } = useContext(QuestionContext)

  const {
    subjectState: { subject, subjects, subjectsLoading },
    getSubjects,
  } = useContext(SubjectContext)

  const emptyAnswer = () => ({ answer: "", correct: false });

  const [questionform, setQuestionform] = useState({
    text: '',
    level: '',
    subjectId: '',
    answers: [
      // the question have 4 answers default.
      emptyAnswer(),
      emptyAnswer(),
      emptyAnswer(),
      emptyAnswer()
    ]
  })

  const add = async event => {
    console.log(questionform);

    try {
      const questionData = await addQuestion(questionform);
      console.log(questionData)

      callbackResponse(questionData, (d) => {
        history.push("/question")
      })
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => { getSubjects(); }, []);

  const onChangeQuestionform = event => setQuestionform({ ...questionform, [event.target.name]: event.target.value })

  const onChangeAnserform = (name, value, index) => setQuestionform(x => {
    // event.target.name.split('.').at(-1) => get the name of input after dot (.) (a.g. answer, correct)
    var answer = { ...x.answers[index], [name]: value };

    return { ...x, answers: replace(x.answers, index, answer) }
  })

  const addAnswer = () => setQuestionform({ ...questionform, answers: [...questionform.answers, emptyAnswer()] })
  const removeAnswer = () => setQuestionform({ ...questionform, answers: removeLastItem(questionform.answers) })

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        FILL INFORMATION
      </Typography>
      <ValidationGroup>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 930 }}>
              <InputLabel id="subjectId">Subject</InputLabel>
              <Select
                labelId="subjectId"
                name='subjectId'
                id="subjectId"
                label="Subject"
                value={questionform.subjectId}
                // @ts-ignore
                onChange={onChangeQuestionform}
              >
                {subjects.map(subject => (
                  <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Validate name="text" required={[true, 'Please fill in this box']}>
              <TextField
                required
                id="text"
                name="text"
                label="Question"
                fullWidth
                autoComplete="text"
                variant="standard"
                onChange={onChangeQuestionform}
              />
            </Validate>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl sx={{ minWidth: 170 }}>
              <InputLabel id="subjectId">Level</InputLabel>
              <Select
                labelId="level"
                name='level'
                id="level"
                label="Level"
                // @ts-ignore
                onChange={onChangeQuestionform}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {questionform.answers.map((answer, index) => (

            <Grid item xs={12}>
              <Grid item xs={10}>
                <Validate name="answer" required={[true, 'Please fill in this box']}>
                  <TextField
                    required
                    id="answer"
                    name={`answers[${index}].answer`}
                    label="answer"
                    fullWidth
                    autoComplete="answer"
                    value={answer.answer}
                    variant="standard"
                    onChange={e => onChangeAnserform("answer", e.target.value, index)}
                  />
                </Validate>
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel control={
                  <Checkbox name={`answers[${index}].correct`} onChange={e => onChangeAnserform("correct", e.target.checked, index)} value={answer.correct} />
                } label="correct ?" />
              </Grid>
            </Grid>
          ))}

          <Button onClick={() => addAnswer()} >
            Add answer
          </Button>

          <Button onClick={() => removeAnswer()} >
            Remove answer
          </Button>


          <Grid item xs={12} />
          <AutoDisabler>
            <Button
              variant="contained"
              onClick={add}
              sx={{ mt: 3, ml: 1 }}
            >
              Add question
            </Button>
          </AutoDisabler>
        </Grid>
      </ValidationGroup>
    </React.Fragment>
  );
}




function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}






function Addfile() {

  const history = useHistory()

  const {
    questionState: { question, questions, questionsLoading },
    addQuestion,
  } = useContext(QuestionContext)

  const {
    subjectState: { subject, subjects, subjectsLoading },
    getSubjects,
  } = useContext(SubjectContext)

  const add = async event => {

    console.log(questionsUpload);
    let count = 0
    for (var i = 0; i < questionsUpload.length; i++) {
      try {
        const questionData = await addQuestion(questionsUpload[i]);
        console.log(questionData)
        count++
        console.log(count);
        setCount(count)
      } catch (error) {
        console.log(error)
      }
    }
    await timeout(6000);
    history.push("/question")
  }

  const chooseFile = (file) => {
    const questions = readFile(file);
  }


  const parseObjectQuestion = (data) => {
    var countQuestionValid = 0;

    var questions = [];

    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      let createQuestion = {
        text: item.text,
        level: item.level,
        subjectId: item.subjectId,
        answers: []
      };
      if (!questionIsValid(createQuestion)) continue;

      for (let j = 1; ; j++) {
        let answer = item["answer" + j];
        let correct = item["correct" + j];
        if (answer === "" || answer == null || correct == null) break;

        let answerQuestion = {
          answer: answer.toString(),
          correct: (correct === "True" || correct === "true" || correct === 1 || correct === "1" || correct === true)
        };

        createQuestion.answers.push(answerQuestion);
      }

      countQuestionValid++;
      questions.push(createQuestion);
    }

    return questions;
  }

  const questionIsValid = (question) => {
    return !!question.text || !!question.level || !!question.subjectId;
  }

  let questionsUpload = [];

  const readFile = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target?.result;

      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      questionsUpload = parseObjectQuestion(data);
    };
  }

  useEffect(() => { getSubjects(); }, []);

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <Grid item xs={200}>
        <Typography variant="h6" gutterBottom>
          ADD FILE
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <input type="file" id="file" onChange={(e) => chooseFile(e.target.files[0])} accept=".xlsx" />
          </Grid>
        </Grid>

        <Grid item xs={12} />
        <Button
          variant="contained"
          onClick={() => { add(); handleClick() }}
          sx={{ mt: 3, ml: 1 }}
        >
          Add question
        </Button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          There are {count} questions successfully added
        </Collapse>
      </Grid>



    </React.Fragment>
  );
}

export { Fillform, Addfile }