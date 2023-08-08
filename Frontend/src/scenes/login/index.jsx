import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const defaultTheme = createTheme();

export default function SignIn() {

    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate()

    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(values)
        try{
            const response = await axios.post('http://127.0.0.1:3002/api/v1/views/login', values)
            console.log(response.data.data.token)
            localStorage.setItem('token',response.data.data.token)
            localStorage.setItem('role',response.data.data.role)
            if(response.data.data.role == 'USER'){
                navigate('/usermainindex')
            }
            else if(response.data.data.role == 'RTO'){
                navigate('/mainindex')
            }
        }catch(err){
            console.log(err)
        }

    }



    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);
    //     console.log({
    //         username: data.get('username'),
    //         password: data.get('password'),
    //     });
    // };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            onChange={e => setValues({ ...values, username: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setValues({ ...values, password: e.target.value })}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>

                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}