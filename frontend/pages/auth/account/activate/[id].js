import Layout from '../../../../components/Layout'
import { useState, useEffect } from 'react'
import { signup } from '../../../../actions/auth'
import { withRouter } from 'next/router'
import jwt from 'jsonwebtoken'

const ActivateAccount = ({ router }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        loading: '',
        success: '',
        showButton: true
    })

    const { name, error, token, loading, showButton, success } = values

    useEffect(() => {
        let token = router.query.id
        if (token) {
            const { name } = jwt.decode(token)
            setValues({ ...values, name, token })
        }
    }, [router])

    const clickSubmit = async (e) => {
        e.preventDefault()
        setValues({ ...values, error: false, loading: true })
        try {
            let data = await signup({ token })

            if (data.error) {
                setValues({ ...values, error: data.error, loading: false, showButton: false })
            } else {
                console.log(data.message)
                setValues({ ...values, error: data.error, loading: false, showButton: false, success: true })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }

    const showLoading = () => (loading ? <h2>Loading...</h2> : '')

    return (
        <Layout>
            <div className="container">
                <h2 className='pt-4'>Hey {name}, Ready to activate your account?</h2>
                {showLoading()}
                {error && error}
                {success && 'You have successfully activated your account. Please signin'}
                {showButton && (
                    <button className="btn btn-outline-info" onClick={clickSubmit}>Activate Account</button>
                )}
            </div>
        </Layout>
    )
}

export default withRouter(ActivateAccount)