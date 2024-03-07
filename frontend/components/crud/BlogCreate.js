// import '../../node_modules/react-quill/dist/quill.snow.css'
import Link from "next/link"
import { useState, useEffect } from "react"
import Router from "next/router"
import dynamic from "next/dynamic"
import { withRouter } from 'next/router'
import { getCookie, Auth } from "../../actions/auth"
import { getCategories } from '../../actions/category'
import { getTags } from '../../actions/tag'
import { createBlog } from "../../actions/blog"


//importing react-quill dynamically
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })



const BlogCreate = ({ router }) => {

    const blogFormLS = () => {  //grab the content from local storage(as a default value)
        if (typeof window === 'undefined') {
            return false
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'))
        } else {
            return false
        }
    }

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    const [checkedCat, setCheckedCat] = useState([])
    const [checkedTag, setCheckedTag] = useState([])

    const [body, setBody] = useState(blogFormLS())
    const [values, setValues] = useState({
        error: '',
        sizeError: '', //if content is too big
        success: '',
        formData: typeof window !== 'undefined' && new FormData(),
        title: '',
        hidePublishButton: false
    })

    const { error, sizeError, success, formData, title, hidePublishButton } = values
    const token = getCookie('token')


    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initCategories()
        initTags()

    }, [router, error])   //if router changes or page reloads


    const initCategories = async () => {
        let data = await getCategories();

        try {
            setCategories(data)
        } catch (error) {
            setValues({ ...values, error: data.error })
        }
    }

    const initTags = async () => {
        let data = await getTags();

        try {
            setTags(data)
        } catch (error) {
            console.log("data.", error)
            setValues({ ...values, error: data.error })
        }
    }

    const publishBlog = async (e) => {
        e.preventDefault()
        formData.set('body', body)
        let data = await createBlog(formData, token)

        console.log("Form data", data)

        try {
            if (data.error) {
                // console.log("Form data", data.error)
                setValues({ ...values, error: data.error })
            } else {
                console.log("Form data", data)
                setValues({ ...values, title: '', error: '', success: `A new blog titled "${data.title}" is created` })
                setBody('')
                setCategories([])
                setTags([])
            }
        } catch (error) {
            setValues({ ...values, error: `Something went wrong!!!` })
        }



    }

    const handleChange = name => e => { //func. returning another func.
        // console.log(e.target.files[0])
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        console.log(formData.get(name))
        setValues({ ...values, [name]: value, formData, error: '' })
    }

    const handleBody = e => {
        console.log(e)

        setBody(e)

        // formData.set('body', body)
        // setValues({ ...values, formData })
        if (typeof window !== 'undefined') { //if window is available
            localStorage.setItem('blog', JSON.stringify(e))
        }
    }

    const handleCatToggle = (c) => {
        setValues({ ...values, error: '' })

        const clicked = checkedCat.indexOf(c) //return the index(if id is +nt) else return -1
        const all = [...checkedCat] //array copy

        if (clicked === -1) {  //if category id isn't +nt then add it
            all.push(c)
        } else {                //if it is +nt then remove it
            all.splice(clicked, 1) //At position clicked(index) remove 1 item
        }

        console.log(all)
        setCheckedCat(all)
        formData.set('categories', all)
    }

    const handleTagToggle = (c) => {
        setValues({ ...values, error: '' })

        const clicked = checkedTag.indexOf(c)
        const all = [...checkedTag]

        if (clicked === -1) {
            all.push(c)
        } else {
            all.splice(clicked, 1)
        }

        console.log(all)
        setCheckedTag(all)
        formData.set('tags', all)
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={() => handleCatToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={() => handleTagToggle(c._id)}
                        type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showError = () => {

        return (<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>)

    }

    const showSuccess = () => {

        return (<div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>)

    }

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="mx-3 my-2 form-group">
                    <label className="text-light">Title</label> {/*text-muted provides #6c757d color*/}
                    <input type="text" className="form-control" onChange={handleChange('title')} value={title} />
                </div>

                <div className="mx-3 form-group">
                    <ReactQuill
                        modules={BlogCreate.modules}
                        formats={BlogCreate.formats}
                        value={body}
                        placeholder='Write something amazing...'
                        onChange={handleBody}
                        className="words"
                    />
                </div>
                {/* <button type="button" className="mx-3 my-2 btn btn-primary">click</button> */}
                <button type="submit" className="mx-3 my-2 btn btn-primary">Publish</button>
            </form>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="pt-3 container">

                        {showError()}

                        {showSuccess()}
                    </div>
                </div>

                <div className="col-md-4 text-light">

                    <div className="conatiner">
                        <div className="form-group pb-2">
                            <h5>Featured image</h5>
                            <hr />
                            <small>Max size:1mb </small>
                            <label className="btn btn-outline-primary">
                                Upload featured image
                                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                            </label>
                        </div>
                    </div>

                    <div className="my-2">
                        <h5>Categories</h5>
                        <hr />
                        <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
                    </div>

                    <div className="my-2">
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    )
}


BlogCreate.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block']
    ]
};

BlogCreate.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
]

// export default withRouter(BlogCreate) //withRouter- higher order wrapper function
export default dynamic(() => Promise.resolve(withRouter(BlogCreate)), { ssr: false })
