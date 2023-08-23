import * as React from 'react';
import Link from '@mui/material/Link';
import { Table } from 'react-bootstrap';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Component } from 'react';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}


function preventDefault(event) {
  event.preventDefault();
}

export class Orders extends Component {

  constructor(props) {
    super(props);
    this.state = { subs: [] }
  }

  refreshList() {
    fetch(process.env.ONLINEEXAM_API + 'Subject')
      .then(response => response.json())
      .then(data => {
        this.setState({ subs: data })
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  render() {
    const { subs } = this.state;
    return (
      <div>
        <Table className='mt-4' striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>NoCredit</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(sub =>
              <tr key={sub.code}>
                <td>{sub.code}</td>
                <td>{sub.name}</td>
                <td>{sub.noCredit}</td>
                <td>Edit / Delete</td>
              </tr>)}
          </tbody>
        </Table>
      </div>
    )
  }

}