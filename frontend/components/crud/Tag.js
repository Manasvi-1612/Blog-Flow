import { useState, useEffect } from 'react'
import { getCookie } from '../../actions/auth'
import { create,getTags,removeTag  } from '../../actions/tag'


export default function Tag() {

    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    })

    const { name, error, success, tags, removed, reload } = values
    const token = getCookie('token')

    useEffect(() => {
        loadTags()
    }, [reload])

    const loadTags = async () => {
        let data = await getTags()
        try {
            setValues({ ...values, tags: data })
        } catch (error) {
            console.log(error)
        }
    }

    const showTags = () => {

        try {
            return tags.map((c, i) => {
                return (
                    <button onDoubleClick={() => deleteConfirm(c.slug)} title='Double click to delete' key={i} className="mx-2 btn btn-outline-primary mr-1 ml-1 mt-3">
                        {c.name}
                    </button>
                )
            })
        } catch (error) {
            console.log(error)
        }

    }

    const deleteConfirm = slug => {
        let answer = window.confirm("Are you sure you want to delete this tag?")
        if (answer) {
            deleteTag(slug)
        }
    }

    const deleteTag = async (slug) => {
        // console.log("deleted",slug)
        let data = await removeTag(slug, token)
        try {
            setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload })
        } catch (error) {
            setValues({ ...values, error: true })
            console.log(error)
        }
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        // console.log("created", name)
        try {
            let data = await create({ name }, token)

            // console.log(data)
            if (data.error) {
                setValues({ ...values, error: false, success: false })
                console.log("err", err.message)
            }
            setValues({ ...values, name: '', error: false, success: true, removed: false, reload: !reload })

        } catch (err) {
            setValues({ ...values, error: true, success: false })
            console.log("err", err.message)
        }
    }

    const handleChange = e => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' })
    }

    const newTagFom = () => {
        return (

            <form onSubmit={clickSubmit}>
                <div className="mx-2 my-2 form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange} type="text" className='form-control' value={name} required />
                </div>

                <div className='mx-2 my-2'>
                    <button type='submit' className='btn btn-primary'>
                        Create
                    </button>
                </div>
            </form>
        )
    }

    const showSuccess = () => {
        if (success) {
            return <p className='text-success'>Tag is created</p>
        }
    }

    const showError = () => {
        if (error) {
            return <p className='text-danger'>Something went wrong</p>
        }
    }

    const showRemoved = () => {
        if (removed) {
            return <p className='text-danger'>Tag is removed</p>
        }
    }

    const mouseMoveHandler = () => {
        setValues({ ...values, error: false, success: false, removed: '' })
    }

    return (
        <>
            <div className='position-fixed'>
                {showSuccess()}
                {showError()}
                {showRemoved()}
            </div>
            <div className='my-5' onMouseMove={mouseMoveHandler}>
                {newTagFom()}
                {showTags()}
            </div>
        </>
    )

}
