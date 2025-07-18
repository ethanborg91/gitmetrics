'use client'
import {useState} from 'react'

export default function LoginPage(){
    const [payload, setPayload] = useState({email: '', password: ''})

    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
     setPayload(prev => ({ ...prev, email: e.target.value }));
    }

        const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setPayload(prev => ({ ...prev, password: e.target.value }));
    }

    return(
        <section className="min-h-screen">
            <div>
                <input type="text" name="email"          onChange={changeEmail}/>
                <input type="text" name="password"        onChange={changePassword}/>
                <button>Login</button>
            </div>
        </section>
    )
}