import React, { useEffect, useState } from 'react'
import { signin, authenticate, Auth } from '../../actions/auth'
import Router from 'next/router'
import Link from 'next/link'
import LoginGoogle from './LoginGoogle'

export default function SigninComponent() {

    useEffect(() => {
        Auth() && Router.push(`/`)
    }, [])


    const [values, setValues] = useState({
        email: 'mans@gmail.com',
        password: 'rrrrrrr',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    //destructuring
    const { email, password, error, loading, message, showForm } = values

    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        setValues({ ...values, loading: true, error: false })
        const user = { email, password }

        try {
            let data = await signin(user)

            if (data.error) {
                console.log(data.error)
                setValues({ ...values, error: data.error, loading: false })
            } else {
                authenticate(data, () => {
                    if (Auth() && Auth().role === 1) {
                        Router.push(`/admin`)
                    } else {
                        Router.push(`/user`)
                    }
                })
            }
        } catch (err) {
            console.log("err", err)
            setValues({ ...values, error: err.message, loading: false })
        }

    }

    const showLoading = () => (
        loading ? <div className='alert alert-info'>Loading...</div> : ''
    )
    const showError = () => (
        error ? <div className='alert alert-danger'>{error}</div> : ''
    )
    const showMessage = () => (
        message ? <div className='alert alert-info'>{message}</div> : ''
    )

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={email} type="email" onChange={handleChange('email')} className="form-control my-3" placeholder="Enter Email" />
                </div>

                <div className="form-group">
                    <input value={password} type="password" onChange={handleChange('password')} className="form-control my-3" placeholder="Enter Password" />
                </div>

                <div className="d-flex text-center">
                    <div>
                        <button type="submit" className="my-4 btn btn-primary">Signin</button>
                    </div>
                    <div className='mx-3 my-4'>
                        <Link href="/auth/password/forgot">Forgot Password</Link>
                    </div>
                </div>
            </form>
        )
    }

    return (
        
            <>
                {showLoading()}
                {showError()}
                <LoginGoogle/>
                {showForm && signinForm()}
            </>
    )
}
