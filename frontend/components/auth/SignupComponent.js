import React, { useState, useEffect, Suspense } from 'react'
import { signup, Auth, preSignup } from '../../actions/auth'
import Router from 'next/router'
import LoginGoogle from './LoginGoogle'


const SignupComponent = () => {


    useEffect(() => {
        if (Auth()) {
            Router.push(`/`)
        }
    }, [])

    const [values, setValues] = useState({
        name: 'mans',
        email: 'mans@gmail.com',
        password: 'rrrrrrr',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    // destructuring
    const { name, email, password, error, loading, message, showForm } = values

    const handleChange = name => e => {
        // console.log(name)
        setValues({ ...values, error: false, [name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setValues({ ...values, loading: true, error: false })
        const user = { name, email, password }

        try {

            let data = await preSignup(user)

            if (data.error) {
                console.log("user",data.error)
                setValues({ ...values, error: data.error, loading: false })
            } else {
                console.log(data.message)
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    message: data.message,
                    loading: false,
                    showForm: false
                })
            }

        } catch (err) {
            console.log(err)
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
        message ? <div className='alert alert-success'>{message}</div> : ''
    )

    const signupForm = () => {
        return (
            <>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input value={name} type="text" onChange={handleChange('name')} className="form-control my-3" placeholder="Enter Name" />
                    </div>

                    <div className="form-group">
                        <input value={email} type="email" onChange={handleChange('email')} className="form-control my-3" placeholder="Enter Email" />
                    </div>

                    <div className="form-group">
                        <input value={password} type="password" onChange={handleChange('password')} className="form-control my-3" placeholder="Enter Password" />
                    </div>

                    <button type="submit" className="my-4 btn btn-primary">Signup</button>
                </form>

            </>

        )
    }

    return (
        <>
            {showLoading()}
            {showError()}
            {showMessage()}
            <LoginGoogle />
            {showForm && signupForm()}
        </>
    )
}


export default SignupComponent