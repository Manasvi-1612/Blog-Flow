// We can define dynamic routes in Next.js using square brackets, [id].js. 
import Head from "next/head"
import Link from "next/link"
import Layout from '../../components/Layout'
import React, { useEffect, useState } from "react"
import { singleBlog, listRelated } from '../../actions/blog'
import moment from "moment/moment"
import renderHTML from 'react-render-html'
import SmallCard from '../../components/blog/SmallCard'
import DisqusThread from "../../components/DisqusThread"
import { withRouter } from "next/router"

const SingleBlog = ({ blog,router }) => {
    const host = "http://localhost:8000/api"

    const [related, setRelated] = useState([])

    const loadRelated = async () => {
        try {
            let data = await listRelated({ blog })

            if (data.error) {
                console.log(data.error)
            } else {
                setRelated(data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadRelated()
    }, [router])

    const showBlogCategories = blog => {
        return blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <button className="btn btn-primary mx-1 ml-1 mt-3">
                    {c.name}
                </button>
            </Link>
        ))
    }

    const showBlogTags = blog => {
        return blog.tags.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <button className="btn btn-outline-primary mx-1 ml-1 mt-3">
                    {c.name}
                </button>
            </Link>
        ))
    }

    const showRelatedBlog = () => {
        return related.map((blog, i) => (
            <div className="col-md-4 mx-2">
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ))
    }

    const showComments = () => {
        return (
            <div className="container" >
                <DisqusThread id={blog._id} title={blog.title} path={`blogs/${blog.slug}`} />
            </div>
        )
    }

    return (
        <React.Fragment>
            <Layout>
                <main>
                    <article className="text-light">
                        <div className="container-fluid">
                            <section >
                                <div className="row" style={{marginTop:'-30px'}}>
                                    <img 
                                        src={`${host}/blog/photo/${blog.slug}`}
                                        alt={blog.title}
                                        className="img img-fluid featured-image"
                                    />
                                </div>
                            </section>

                            <section className="mt-5 mb-5 text-center">
                                <h1>
                                    {blog.title}
                                </h1>
                            </section>

                            <section className="container">
                                <div className="lead mt-3 mark text-dark">
                                    Written by <Link href={`/profile/${blog.postedBy.username}`} style={{ textDecoration: 'none' }}>{blog.postedBy.username}</Link> | Published {moment(blog.updatedAt).fromNow()}
                                </div>

                                <section className="d-flex">
                                    <section className="mx-1">
                                        {showBlogCategories(blog)}
                                    </section>

                                    <section className="mx-1">
                                        {showBlogTags(blog)}
                                    </section>
                                </section>
                            </section>
                        </div>

                        <div className="container mt-4">
                            <section>
                                <div className="col-md-12 lead">
                                    {renderHTML(blog.body)}
                                </div>
                            </section>
                        </div>

                        {related.length>0 && <div className="container">
                            <h4 className="text-center pt-5 h2"><u>Related blog</u></h4>

                            <div className="d-flex">
                                {showRelatedBlog()}
                            </div>
                        </div>}

                        <div className="container pb-5 pt-5">
                            {showComments()}
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    )
}

SingleBlog.getInitialProps = async ({ query }) => { //this happen before the page render on client side
    console.log("query.slug")
    try {
        let data = await singleBlog(query.slug)

        if (data.error) {
            console.log(data.error)
        } else {
            return {
                blog: data
            }
        }
    } catch (error) {
        console.log(error)
        return {
            error
        }
    }
}

// export default dynamic(() => Promise.resolve(withRouter(SingleBlog)), { ssr: false }) //remove hydration error

export default withRouter(SingleBlog)