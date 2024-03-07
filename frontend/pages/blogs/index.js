import Head from "next/head"
import Link from "next/link"
import Layout from '../../components/Layout'
import { useState,useRef } from "react"
import { lstBlogsCatsTags } from '../../actions/blog'
import Card from '../../components/blog/Card'
import { withRouter } from "next/router"
import Search from "../../components/blog/Search"
import Landing from "../../components/Landing"

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router }) => {

    //Head--(to do)

    const [limit, setLimit] = useState(blogsLimit)
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(totalBlogs)
    const [loadedBlogs, setLoadedBlogs] = useState([])
    const Headingref = useRef(null)

    const loadMore = async () => {
        let toSkip = skip + limit
        try {
            let data = await lstBlogsCatsTags(toSkip, limit)
            if (data.error) {
                console.log(data.error)
            }

            setLoadedBlogs([...loadedBlogs, data.blogs])
            setSize(data.size)    //2 in size
            console.log("size", size)
            setSkip(toSkip)
        } catch (error) {
            console.log(error)
        }
    }

    const loadMoreButton = () => {
        console.log("clicked size", size)
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More</button>
            )
        )
    }

    const showAllBlogs = () => {

        return (blogs.map((blog, i) => {

            return (
                <article key={i}>
                    <Card blog={blog} />
                    <hr />
                </article>
            )
        }))
    }

    const showAllCategories = () => {
        return categories !== undefined ? (categories
            .map((c, i) => (
                <Link href={`/categories/${c.slug}`} key={i}>
                    <button className="btn btn-primary mx-1 mt-3">{c.name}</button>
                </Link>
            ))) : ('')
    }

    const showAllTags = () => {
        return tags !== undefined ? (tags
            .map((c, i) => (
                <Link href={`/tags/${c.slug}`} key={i}>
                    <button className="btn btn-outline-primary mx-1 ml-1 mt-3">{c.name}</button>
                </Link>
            ))) : ('')
    }

    const showLoadedBlogs = () => {

        return (loadedBlogs.map((blog, i) =>
            blog.map((b, i) => (
                <article key={i}>
                    <Card blog={b} />
                    <hr />
                </article>
            ))
        ))

    }

    return (
        blogs !== undefined ? (
            <>
                <Layout>
                    <div className="container-fluid pb-4">
                        <Search />
                    </div>
                    <main>
                        <div className="mt-2">
                            <div className="container-fluid">
                                <header>
                                    <div className="col-md-12">
                                        <header className="Sub-Header">
                                            <Landing>
                                                <h2 ref={Headingref} className="heading">
                                                    <span>B</span>
                                                    <span>l</span>
                                                    <span>o</span>
                                                    <span>g</span>
                                                    <span>s</span>
                                                </h2>
                                            </Landing>
                                        </header>
                                    </div>

                                    <section className="pd-5 text-center">
                                        {showAllCategories()}
                                        <br />
                                        {showAllTags()}
                                    </section>

                                </header>
                            </div>

                            <div className="container-fluid">  {/*this one is for first load*/}
                                {showAllBlogs()}
                            </div>

                            <div className="container-fluid">
                                {showLoadedBlogs()}
                            </div>

                            <div className="text-center pt-5 pb-5">
                                {loadMoreButton()}
                            </div>
                        </div>

                    </main>

                </Layout>
            </>) : (
            <div className="row my-5">
                <div className="d-flex align-items-center justify-content-center">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII=" alt="" />
                </div>


                <h4 className="d-flex mx-5 my-3 align-items-center justify-content-center text-muted">
                    <span>This site can’t be reached</span>
                </h4>

            </div>
        )
    )
}

//getInitialProps -runs on the server side before rendering a page. This function allows you to fetch data from an external API, database, or any other data source, and pass it as props to your React components(Blogs)
Blogs.getInitialProps = async () => {

    let skip = 0
    let limit = 2  //initially 2(starting) blogs will get
    try {
        let data = await lstBlogsCatsTags(skip, limit)

        if (data.error) {
            console.log(data.error)
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogSkip: skip
            }
        }
    } catch (error) {
        return {
            error
        }
    }
}

export default withRouter(Blogs)