import Layout from '../../../components/Layout'
import { useState } from 'react'
import { forgotPassword } from '../../../actions/auth'

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true
    })

    const { email, message, error, showForm } = values

    const handleChange = name => e => {
        setValues({ ...values, message: '', error: '', [name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValues({ ...values, message: '...Loading', error: '' })

        try {
            let data = await forgotPassword({ email })

            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, message: data.message, email: '', showForm: false })
            }
        } catch (error) {
            console.log(error)
            // setValues({ ...values, error })
        }
    }

    const showError = () => (
        error ? <div className="alert alert-danger">{error}</div> : ''
    )

    const showSuccess = () => (
        message ? <div className="alert alert-success">{message}</div> : ''
    )


    const passwordForgotForm = () => {
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group pt-5">
                        <input
                            type='email'
                            onChange={handleChange('email')}
                            className='form-control'
                            value={email}
                            placeholder='Type your email'
                            required />
                    </div>

                    <div className='mt-3'>
                        <button className='btn btn-primary'>Send password reset link</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <Layout>
            <div className="container">
                <h2>Forgot Password</h2>
                <hr />
                {showError()}
                {showSuccess()}
                {showForm && passwordForgotForm()}
            </div>
        </Layout>
    )
}

export default ForgotPassword