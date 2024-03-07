import Head from "next/head"
import Link from "next/link"
import Layout from '../../components/Layout'
import React, { useEffect, useState } from "react"
import moment from "moment/moment"
import { userPublicProfile } from '../../actions/user'
const host = 'http://localhost:8000/api'
import dynamic from "next/dynamic"
import { withRouter } from "next/router"
import ContactForm from "../../components/form/ContactForm"

const UserProfile = ({ user, blogs }) => {

    const showUserBlog = () => {
        return blogs.map((blog, i) => {
            return (
                <div className="mt-4 mb-4" key={i}>
                    <Link href={`/blogs/${blog.slug}`} className="lead" style={{ textDecoration: 'none' }}>
                        {blog.title}
                    </Link>
                </div>
            )
        })
    }

    return (
        <>
            <Layout>
                <div className="container pt-2">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>{user.name}</h5>
                                            <div className="text-muted">Joined {moment(user.updatedAt).fromNow()}</div>
                                        </div>

                                        <div className="col-md-4">
                                            <img src={`${host}/user/photo/${user._id}`}
                                                id='thumbnail-img'
                                                className='img img-fluid img-thumbnail mb-3 mx-5'
                                                style={{ maxHeight: '70%', maxWidth: '70%' }}
                                                alt="user profile" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br />

                <div className="container pb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 px-4 text-light">Recent blogs by {user.name}</h5>

                                    <div>{showUserBlog()}</div>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 px-4 text-white">Message {user.name}</h5>

                                    <br />
                                    <ContactForm authorMail={user.email} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

UserProfile.getInitialProps = async ({ query }) => {
    let data = await userPublicProfile(query.username)

    if (data.error) {
        console.log(data.error)
    } else {
        return {
            user: data.user,
            blogs: data.blogs
        }
    }
}

export default UserProfile
// export default dynamic(() => Promise.resolve(withRouter(UserProfile)), { ssr: false })