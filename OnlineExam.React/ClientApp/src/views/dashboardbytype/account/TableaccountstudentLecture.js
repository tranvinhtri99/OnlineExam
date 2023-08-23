import * as React from 'react';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../../../components/dashboard/Title';
import { useContext, useState, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext"
import { ClassroomContext } from "../../../contexts/ClassroomContext"
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { InputGroup } from 'react-bootstrap';

export default function Tableaccount() {
    const {
        accountState: { account, accounts, accountsLoading },
        getAccounts,
        getAccountsStudent,
        deleteAccount,
        showToast: { show, message, type },
        setShowToast,
        setShowUpdateAccountModal,
        findAccount,
        updateAccountStudent,
        resetPass,
    } = useContext(AccountContext)

    const {
        // @ts-ignore
        classroomState: { classroom, classrooms, classroomsLoading },
        getClassrooms,
    } = useContext(ClassroomContext)

    const [search, setSearch] = useState('')
    const [classname, setClassname] = useState('')

    useEffect(() => { getAccountsStudent(); }, []);
    useEffect(() => { getClassrooms(); }, []);


    const chooseAccount = account => {
        console.log(account);
        findAccount(account);
        setShowUpdateAccountModal(true);
    }

    const [update, setUpdate] = useState({ open: false, account: null });

    const onUpdateAccount = async (e) => {
        console.log(update.account);
        const data = await updateAccountStudent(update.account)
        window.location.reload();
        console.log(data);
        // window.location.reload();
        return data.type == 0;
    }

    const updateName = (name) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, name } };
        })
    }

    const updateUsername = (username) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, username } };
        })
    }

    const updateClassroomId = (classroomId) => {
        console.log(classroomId);
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, classroomId } };
        })
    }

    const resetPassword = async (userId) => {
        const data = await resetPass(userId)
        alert("password has been reset. Aa12345@")
        console.log(data);
        return data;
    }

    return (
        <>
            <React.Fragment>
                <Title>Account Student List</Title>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="classroomId">Search Classroom</InputLabel>
                    <Select
                        labelId="classroomId"
                        name='classroomId'
                        id="classroomId"
                        label="Search Classroom"
                        onChange={(e) => setSearch(e.target.value)}
                    >
                        <MenuItem value={""}>None</MenuItem>
                        {classrooms.map(classroom => (
                            <MenuItem value={classroom.name}>{classroom.name}</MenuItem>
                        ))}
                    </Select>
                    {/* <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search Classroom' /> */}
                </FormControl>
                {accountsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Class</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.filter((item) => {
                                if (item.classroom?.name == null) return false;
                                return search.toLocaleLowerCase() === ''
                                    ? item
                                    : item.classroom.name.toLowerCase().includes(search.toLowerCase());
                            }).map((account, index) => {
                                if (account.type == 'Student') {
                                    return (
                                        <TableRow key={account.id}>
                                            <TableCell>{account.username}</TableCell>
                                            <TableCell>{account.name}</TableCell>
                                            <TableCell>{account.type}</TableCell>
                                            
                                            <TableCell>{account.classroom.name}</TableCell>
                                            {console.log(account.classroom.name)}
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>)}
            </React.Fragment>
            <PopupEdit title={"Update account"}
                open={update.open} onclose={() => setUpdate({ open: false, account: null })} onSubmit={(e) => onUpdateAccount(e)} >
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Username' name='username' require="true"
                        aria-describedby='title-help' value={update.account?.username} onChange={e => updateUsername(e.target.value)} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Name' name='name' require="true"
                        aria-describedby='title-help' value={update.account?.name} onChange={e => updateName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="classroomId">Classroom</InputLabel>
                        <Select
                            labelId="classroomId"
                            name='classroomId'
                            id="classroomId"
                            label="classroom"
                            value={update.account?.classroomId}
                            // @ts-ignore
                            onChange={e => updateClassroomId(e.target.value)}
                        >
                            {classrooms.map(classroom => (
                                <MenuItem key={classroom.id} value={classroom.id} >{classroom.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Form.Group>
            </PopupEdit>

            {/* <OverlayTrigger overlay={<Tooltip>Add new class</Tooltip>}>
                <button className='btn-floating' onClick={() => setShowAddAccountModal(true)}>
                    <img src={addIcon} alt="add-brief" width='60' height='60' />
                </button>
            </OverlayTrigger>
            <AddAccountButton />
            {account != null && <UpdateAccountButton />} */}

            <Toast show={show}
                style={{ position: 'fixed', top: '20%', right: '10px' }}
                className={`bg-${type} text-white`}
                onClose={() => setShowToast({ show: false, message: '', type: null })}
                delay={3000}
                autohide
            >
                <Toast.Body>
                    <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </>
    )
}