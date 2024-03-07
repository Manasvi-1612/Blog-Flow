import Layout from '../../../../components/Layout'
import { useState } from 'react'
import { resetPassword } from '../../../../actions/auth'
import { withRouter } from 'next/router'

const ResetPassword = ({ router }) => {
    const [values, setValues] = useState({
        name: '',
        newPassword: '',
        error: '',
        message: '',
        showForm: true
    })

    const { name, newPassword, error, message, showForm } = values

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let data = await resetPassword({
                newPassword,
                resetPasswordLink: router.query.id //file name is 'id'
            })

            if (data.error) {
                console.log(data.error)
                setValues({ ...values, error: data.error, newPassword: '' })
            } else {
                console.log(data.message)
                setValues({ ...values, message: data.message, showForm: false, newPassword: '', error: false })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }

    const showError = () => (
        error ? <div className="alert alert-danger">{error}</div> : ''
    )

    const showSuccess = () => (
        message ? <div className="alert alert-success">{message}</div> : ''
    )

    const passwordResetForm = () => {
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group pt-5">
                        <input
                            type='password'
                            onChange={e=> setValues({...values,newPassword: e.target.value})}
                            className='form-control'
                            value={newPassword}
                            placeholder='Type new password'
                            required />
                    </div>

                    <div className='mt-3'>
                        <button className='btn btn-primary'>Change Password</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <Layout>
            {/* {console.log(router)} */}
            <div className="container">
                <h2>Reset Password</h2>
                <hr />
                {showError()}
                {showSuccess()}
                {showForm && passwordResetForm()}
            </div>
        </Layout>
    )
}

export default withRouter(ResetPassword)
