import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { AccountContext } from '../../../../contexts/AccountContext';
import { useHistory } from 'react-router-dom';
import { callbackResponse } from '../../../../helpers/utils';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';

export default function Fillform() {
  const history = useHistory()

  const {
    accountState: { account, accounts, accountsLoading },
    addAccountLecture,
  } = useContext(AccountContext)

  const [accountform, setAccountform] = useState({
    username: '',
    password: '',
    name: '',
  })

  const add = async event => {
    console.log(accountform);

    try {
      const accountData = await addAccountLecture(accountform);
      console.log(accountData)

      callbackResponse(accountData, (d) => {
        history.push("/accountlecture")
      })
    } catch (error) {
      console.log(error)
    }

  }

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
                label="username"
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
                label="password"
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
  );
}