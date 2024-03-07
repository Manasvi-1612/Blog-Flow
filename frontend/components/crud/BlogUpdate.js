import Link from "next/link"
import { useState, useEffect } from "react"
import Router from "next/router"
import dynamic from "next/dynamic"
import { withRouter } from 'next/router'
import { getCookie, Auth } from "../../actions/auth"
import { getCategories } from '../../actions/category'
import { getTags } from '../../actions/tag'
import { singleBlog, updateBlog } from "../../actions/blog"

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const host = 'http://localhost:8000/api'

const BlogUpdate = ({ router }) => {

    const [body, setBody] = useState('')
    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: new FormData(),
        title: ''
    })
    const { formData, error, title, success } = values

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    const [checkedCat, setCheckedCat] = useState([])
    const [checkedTag, setCheckedTag] = useState([])

    const token = getCookie('token')

    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initBlog()
        initCategories()
        initTags()
    }, [router])

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

    const initBlog = async () => {
        if (router.query.slug) {
            try {
                let data = await singleBlog(router.query.slug)

                if (data.error) {
                    console.log(data.error)
                } else {
                    setValues({ ...values, title: data.title })
                    setBody(data.body)
                    setCategoriesArray(data.categories)
                    setTagsArray(data.tags)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const setCategoriesArray = blogCategories => {
        let ca = []
        blogCategories.map((c, i) => {
            // console.log(c)
            ca.push(c._id)
        })

        console.log(ca)
        setCheckedCat(ca)
        console.log(checkedCat)
    }

    const setTagsArray = blogTags => {
        let ca = []
        blogTags.map((c, i) => {
            ca.push(c._id)
        })
        setCheckedTag(ca)
    }


    const handleChange = name => e => { //func. returning another func.
        // console.log(e.target.files[0])
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        console.log(formData.get(name))
        setValues({ ...values, [name]: value, formData, error: '' })
    }

    const editBlog = async (e) => {
        e.preventDefault()
        console.log("updated", checkedCat)

        formData.append('categories', checkedCat)

        console.log("formData.get('categories')", formData.get('categories'))
        try {
            let data = await updateBlog(formData, token, router.query.slug)

            if (data.error) {
                console.log(data.error)
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, success: `Blog titled "${router.query.slug}" is successfully updated` })

                if (Auth() && Auth().role === 1) {
                    // Router.push(`/admin/crud/${router.query.slug}`)
                    Router.push(`/admin`)
                } else if (Auth() && Auth().role === 0) {
                    // Router.replace(`/user/crud/${router.query.slug}`)
                    Router.replace(`/user`)
                }
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }

    const handleBody = e => {
        setBody(e)
        formData.set('body', e)
    }

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }

    const showSuccess = () => {
        return (
            <div className="pb-2 alert alert-success" style={{ display: success ? '' : 'none' }}>
                {success}
            </div>
        )
    }

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="mx-3 form-group">
                    <label className="text-muted">Title</label> {/*text-muted provides #6c757d color*/}
                    <input type="text" className="form-control" onChange={handleChange('title')} value={title} />
                </div>

                <div className="mx-3 form-group">
                    <ReactQuill
                        modules={BlogUpdate.modules}
                        formats={BlogUpdate.formats}
                        value={body}
                        placeholder='Write something amazing...'
                        onChange={handleBody}
                    />
                </div>
                <button type="submit" className="mx-3 my-2 btn btn-primary">Update</button>
            </form>
        )
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

        setCheckedCat(all)
        console.log(checkedCat)

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

    const findOutCategories = c => {
        const res = checkedCat.indexOf(c)

        if (res !== -1) {
            return true
        }

        return false
    }

    const findOutTags = c => {
        const res = checkedTag.indexOf(c)

        if (res !== -1) {
            return true
        }

        return false
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={() => handleCatToggle(c._id)} checked={findOutCategories(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={() => handleTagToggle(c._id)} checked={findOutTags(c._id)}
                        type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    <div className="pb-3 container">
                        {showError()}
                        {showSuccess()}
                    </div>
                    {updateBlogForm()}

                    {body && <img src={`${host}/blog/photo/${router.query.slug}`} alt={title} style={{width: '50%',height: '500px'}}/>}

                </div>

                <div className="col-md-4">

                    <div className="conatiner">
                        <div className="form-group pb-2">
                            <h5>Featured image</h5>
                            <hr />
                            <small className="text-muted">Max size: 1mb</small>
                            <label className="btn btn-outline info">
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

BlogUpdate.modules = {
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

BlogUpdate.formats = [
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

export default dynamic(() => Promise.resolve(withRouter(BlogUpdate)), { ssr: false })