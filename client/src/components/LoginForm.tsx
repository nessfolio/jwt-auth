'use client'

import React, {FC, useState} from 'react';
import {useStore} from "@/src/store/store";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {login, registration} = useStore()

    return (
        <div>
            <input
                onChange={event => setEmail(event.target.value)}
                value={email}
                type="text"
                placeholder='Email'
            />

            <input
                onChange={event => setPassword(event.target.value)}
                value={password}
                type="password"
                placeholder='Password'
            />
            <button onClick={() => login(email, password)}>Login</button>
            <button onClick={() => registration(email, password)}>Registration</button>
        </div>
    );
};

export default LoginForm;