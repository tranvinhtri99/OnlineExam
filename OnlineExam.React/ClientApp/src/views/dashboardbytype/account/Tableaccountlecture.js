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
import Button from '@mui/material/Button'
import Toast from 'react-bootstrap/Toast'
import Form from 'react-bootstrap/Form'
import { PopupEdit } from '../../../components/popup_edit/popup_edit';
import { confirmDelete } from '../../../components/popup_edit/confirm_delete';

export default function Tableaccount() {
    const {
        accountState: { account, accounts, accountsLoading },
        getAccounts,
        deleteAccount,
        showToast: { show, message, type },
        setShowToast,
        setShowUpdateAccountModal,
        findAccount,
        updateAccountLecture,
        resetPass
    } = useContext(AccountContext)

    useEffect(() => { getAccounts(); }, []);

    const chooseAccount = account => {
        console.log(account);
        findAccount(account);
        setShowUpdateAccountModal(true);
    }

    const [update, setUpdate] = useState({ open: false, account: null });

    const onUpdateAccount = async (e) => {

        const data = await updateAccountLecture(update.account)
        console.log(data);
        window.location.reload();
        return data.type == 0;
    }

    const updateName = (name) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, name } };
        })
    }

    const updateCode = (code) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, code } };
        })
    }

    const updatenoCredit = (noCredit) => {
        setUpdate(state => {
            // @ts-ignore
            return { ...state, account: { ...state.account, noCredit } };
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
                <Title>Account Lecturer List</Title>
                {accountsLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>loading ... </div> : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Reset</TableCell>
                                <TableCell>Option</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((account, index) => {
                                if (account.type == 'Lecturer') {
                                    return (
                                        <TableRow key={account.id}>
                                            <TableCell>{account.username}</TableCell>
                                            <TableCell>{account.name}</TableCell>
                                            <TableCell>{account.type}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    sx={{ mt: 1, ml: 1, mb: 1 }}
                                                    onClick={() => resetPassword(account.id)}
                                                >
                                                    Reset password
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => setUpdate({ open: true, account })}>Edit</Button>
                                                <Button onClick={() => confirmDelete(() => deleteAccount(account.id))}>Remove</Button>
                                            </TableCell>
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
                    <Form.Control type='text' placeholder='Username' name='Username' require="true"
                        aria-describedby='title-help' value={update.account?.username} onChange={e => updatenoCredit(e.target.value)} disabled/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder='Name' name='Name' require="true"
                        aria-describedby='title-help' value={update.account?.name} onChange={e => updateName(e.target.value)} />
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