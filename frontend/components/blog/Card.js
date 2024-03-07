import Head from "next/head"
import Link from "next/link"
import moment from "moment/moment"
import renderHTML from 'react-render-html'

const Card = ({ blog }) => {

    const host = 'http://localhost:8000/api'

    const showBlogCategories = blog => {
        return blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <button className="btn btn-primary mx-1 mt-3">
                    {c.name}
                </button>
            </Link>
        ))
    }

    const showBlogTags = blog => {
        return blog.tags.map((c, i) => (
            <Link key={i} href={`/tags/${c.slug}`}>
                <button className="btn btn-outline-primary mx-1 mt-3">
                    {c.name}
                </button>
            </Link>
        ))
    }

    return (
        <div className="lead pb-4 text-light">
            <header>
                <Link href={`/blogs/${blog.slug}`}> 
                    <h2 className="pt-3 pb-3 font-weight-bold">
                        {blog.title}
                    </h2>
                </Link>
            </header>

            <section>
                <div className="mark ml-1 pt-2 pb-2 text-dark"> {/*mark class- yellowish color */}
                    Written by <Link href={`/profile/${blog.postedBy.username}`} style={{textDecoration:'none'}}>{blog.postedBy.username}</Link> | Published {moment(blog.updatedAt).fromNow()}
                </div>
            </section>

            <section className="d-flex">
                <section className="mx-1">
                    {showBlogCategories(blog)}
                </section>

                <section className="mx-1">
                    {showBlogTags(blog)}
                </section>
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section className="my-5">
                        <img className="img img-fluid" style={{ maxHeight: '300px', width: '70%' }} src={`${host}/blog/photo/${blog.slug}`} alt={blog.title} />
                    </section>
                </div>
                <div className="col-md-8">
                    <section className="pt-5">
                        <div className="container pt-3 pb-3">
                            {renderHTML(blog.excerpt)}
                        </div>

                        <Link href={`/blogs/${blog.slug}`}>
                            <button className="btn btn-primary">
                                Read more
                            </button>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    )
}


export default Card