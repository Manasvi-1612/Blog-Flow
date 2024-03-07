import Link from "next/link"
import { useState, useEffect } from "react"
import Router from "next/router"
import { getCookie, Auth } from "../../actions/auth"
import { list, removeBlog, updateBlog } from "../../actions/blog"
import moment from "moment/moment"

const BlogRead = ({username}) => {

    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState('')
    const token = getCookie('token')

    useEffect(() => {
        loadBlogs()
    }, [])

    const loadBlogs = async () => {
        try {
            let data = await list(username)

            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBlog = async (slug) => {
        try {
            let data = await removeBlog(slug, token)
            if (data.error) {
                console.log(data.error)
            } else {
                setMessage(data.message)
                loadBlogs()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteConfirm = (slug) => {
        let ans = window.confirm('Are you sure you want to delete this blog?')
        if (ans) {
            deleteBlog(slug)
        }
    }

    const showUpdateButton = (blog) => {
        if (Auth() && Auth().role === 0) { //regular user
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <button className="btn btn-sm btn-warning">Update</button>
                </Link>
            )
        } else if (Auth() && Auth().role === 1) { //Admin
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <button className="mx-5 btn btn-sm btn-warning">Update</button>
                </Link>
            )
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div key={i} className="pb-5">
                    <h3>
                        {blog.title}
                    </h3>
                    <p className="mark">
                        Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>

                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>
                        Delete
                    </button>
                    {/* {JSON.stringify(Auth())} */}
                    {showUpdateButton(blog)}
                </div>
            )
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">

                    {message && <div className="alert alert-warning">{message}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </>
    )
}

export default BlogRead