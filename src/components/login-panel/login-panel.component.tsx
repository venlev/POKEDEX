import './login-panel.component.css';
import Tab from '@mui/material/Tab/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { auth } from '../../firebase';
import { setUser } from '../../services/user-store.service';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';

const LoginManager = () => {
    const [value, setValue] = React.useState('1');

    /* STATES FOR NORMAL LOGIN */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /* STATES FOR USER CREATION */
    const [r_email, r_setEmail] = useState('');
    const [r_password, r_setPassword] = useState('');
    const [r_passwordConfirm, r_setPasswordConfirm] = useState('');


    /* HANDLERS */
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    /* USER CREATION */
    const performUserCreation = () => {
        let fieldsNotNull = (r_email && r_password && r_passwordConfirm);
        let fieldsAreNotEmpty = (r_email !== '' && r_password !== '' && r_passwordConfirm !== '');

        if (fieldsNotNull && fieldsAreNotEmpty) {
            if (r_password === r_passwordConfirm) {
                createUserWithEmailAndPassword(auth, r_email, r_password)
                    .then((userCredentials) => {
                        if (userCredentials.user) {
                            window.alert('Successful registration!');
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        if (error.toString().includes('auth/weak-password')) window.alert('Weak password! Your password has to be at least 6 characters long.');
                        if (error.toString().includes('auth/invalid-email')) window.alert('Your email address is in an invalid format!');
                    })
            } else window.alert('Passwords do not match!');
        } else window.alert('You have to fill the whole form to procceed!');
    }

    /* NORMAL LOGIN */
    const performLogin = () => {
        if ((email && password) && (email !== '' && password !== '')) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    setUser(userCredentials);
                    window.location.reload();
                })
                .catch((error) => {
                    if (error.toString().includes('auth/invalid-login-credentials')) window.alert('Invalid credentials! Maybe you just misstyped your password, please try again!');
                    if (error.toString().includes('auth/invalid-email')) window.alert('Your email address is in an invalid format!');
                });
        } else window.alert('Oops! Something is missing!')
    }

    return (
        <div id="login-panel">
            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="LOGIN" value="1" />
                    <Tab label="REGISTER" value="2" />
                </TabList>
                <TabPanel className='tab-panel-backdrop' value="1">
                    <h2 className='simple-title'>We detected that you are not logged in</h2>
                    <span>Please log in or create an account to use this app!</span>
                    <div id="login-form">
                        <TextField className="login-textfield" label="Email" type="email" placeholder="your@email.com..." variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField className="login-textfield" label="Password" type="password" placeholder="Your password..." variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <Button className="login-textfield" variant="contained" startIcon={<AccountCircleIcon />} onClick={performLogin}>
                            Login
                        </Button>
                    </div>
                </TabPanel>
                <TabPanel className='tab-panel-backdrop' value="2">
                    <h2 className='simple-title'>Register a brand new Pokedex account...</h2>
                    <span>You can register your own pokedex account here...</span>
                    <div id="login-form">
                        <TextField className="login-textfield" label="Email" type="email" placeholder="your@email.com" variant="outlined" value={r_email} onChange={(e) => r_setEmail(e.target.value)} />
                        <TextField className="login-textfield" label="Password" type="password" placeholder="Your password..." variant="outlined" value={r_password} onChange={(e) => r_setPassword(e.target.value)} />
                        <TextField className="login-textfield" label="Confirm" type="password" placeholder="Confirm password..." variant="outlined" value={r_passwordConfirm} onChange={(e) => r_setPasswordConfirm(e.target.value)} />
                        <Button className="login-textfield" variant="contained" startIcon={<AccountCircleIcon />} onClick={performUserCreation}>
                            Sign up!
                        </Button>
                    </div>
                </TabPanel>
            </TabContext>
        </div>
    )
}

export default LoginManager;