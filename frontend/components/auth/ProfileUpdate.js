import { useEffect, useState } from 'react'
import { getCookie, updateForm } from '../../actions/auth'
import { getProfile, update } from '../../actions/user'

const ProfileUpdate = () => {

    const host = 'http://localhost:8000/api'

    const [values, setValues] = useState({
        id: '',
        username: '',
        name: '',
        email: '',
        about: '',
        password: '',
        error: '',
        success: '',
        loading: '',
        photo: '',
        userData: new FormData(),
    })

    const token = getCookie('token')
    const { id, username, name, email, about, password, error, success, photo, loading, userData } = values

    const init = async () => {
        try {
            let data = await getProfile(token)

            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    id: data._id,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about
                })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }
    useEffect(() => {
        init()
    }, [])

    const handleChange = name => async (e) => {

        if (name === 'photo') {
            uploader(e)
        }
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        // let userFormData = new FormData()
        userData.set(name, value)
        setValues({ ...values, [name]: value, userData, error: false, success: false })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValues({ ...values, loading: true })

        // console.log("photo",photo)
        try {
            let data = await update(token, userData)

            if (data.error) {
                console.log(data.error)
                if(data.error.code===11000){
                    setValues({ ...values, error: 'User with this email exists already', success: false, loading: false })
                }else{
                    setValues({ ...values, error: data.error, success: false, loading: false })
                }
                
            } else {

                // console.log(data.name)
                updateForm(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        success: true,
                        loading: false
                    })
                })
            }
        } catch (error) {
            setValues({ ...values, error })
            console.log(error)
        }
    }


    function useDisplayImage() {
        const [result, setResult] = useState("");

        function uploader(e) {
            const imageFile = e.target.files[0];

            const reader = new FileReader();
            reader.addEventListener("load", (e) => {
                setResult(e.target.result);
            });
            
            if(imageFile!=undefined){
                reader.readAsDataURL(imageFile);
            }
        }

        return { result, uploader };
    }

    const { result, uploader } = useDisplayImage();

    const ProfileUpdateForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label className="btn btn-outline-info">
                        Profile Photo
                        <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                    </label>
                </div>
                <div className="form-group">
                    <label className="text-muted">Username</label>
                    <input onChange={handleChange('username')} type="text" value={username} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange('name')} type="text" value={name} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={handleChange('email')} type="email" value={email} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">About</label>
                    <input onChange={handleChange('about')} type="text" value={about} className="form-control" />
                </div>
                {/* <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={handleChange('password')} type="password" value={password} className="form-control" />
                </div> */}
                <div className='mt-3'>
                    <button onClick={handleSubmit} className='btn btn-primary'>Submit</button>
                </div>
            </form>
        )
    }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            Profile Updated
        </div>
    )

    const showLoading = () => (
        <div className="alert alert-info" style={{ display: loading ? '' : 'none' }}>
            Loading...
        </div>
    )

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mt-5">
                        {/* {JSON.stringify(userData.get('photo'))} */}
                        <img src={result ? result : `${host}/user/photo/${id}`}
                            id='thumbnail-img'
                            className='img img-fluid img-thumbnail mb-3 mx-5'
                            style={{ maxHeight: '70%', maxWidth: '70%' }}
                            alt="user profile" />
                    </div>

                    <div className="col-md-8 mt-5">
                        {showSuccess()}
                        {showLoading()}
                        {showError()}
                        {ProfileUpdateForm()}
                    </div>
                </div>
            </div>
        </>
    )
}


export default ProfileUpdate