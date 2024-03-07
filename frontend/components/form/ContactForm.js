import { useState } from 'react'
import { emailContactForm } from '../../actions/form'
import Link from 'next'

const ContactForm = ({authorMail}) => {

    const [values, setValues] = useState({
        message: '',
        name: '',
        email: '',
        sent: false,
        buttonText: 'Send Message',
        success: false,
        error: false
    })

    const { message, name, email, sent, buttonText, success, error } = values

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValues({ ...values, buttonText: 'Sending...' })
        try {
            let data = await emailContactForm({authorMail, name, email, message })
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    sent: true,
                    name: '',
                    email: '',
                    message: '',
                    buttonText: 'Sent',
                    success: data.success
                })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }

    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value, error: false, success: false, buttonText: 'Send Message' })
    }

    const showSuccess = () => {
        return (
            <div className="alert alert-info">
                Thank you for contacting us.
            </div>
        )
    }

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }

    const contactForm = () => {
        return (
            <form onSubmit={handleSubmit} className='text-light'>
                <div className="form-group">
                    <label className="lead">Message</label>
                    <textarea onChange={handleChange('message')} value={message} className='form-control' type="text" rows="10" required></textarea>
                </div>

                <div className="form-group">
                    <label className="lead">Name</label>
                    <input onChange={handleChange('name')} value={name} className='form-control' type="text" required></input>
                </div>

                <div className="form-group">
                    <label className="lead">Email</label>
                    <input onChange={handleChange('email')} value={email} className='form-control' type="email" required></input>
                </div>

                <div className='mt-3'>
                    <button className="btn btn-primary">
                        {buttonText}
                    </button>
                </div>
            </form>
        )
    }

    return (
        <>
            {sent && showSuccess()}
            {showError()}
            {contactForm()}
        </>
    )
}



export default ContactForm