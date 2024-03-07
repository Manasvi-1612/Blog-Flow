import Head from "next/head"
import Link from "next/link"
import moment from "moment/moment"
import renderHTML from 'react-render-html'

const SmallCard = ({ blog }) => {

    const host = 'http://localhost:8000/api'


    return (
        <div className="container SmallCardConatiner">

            <div className="card Small-Card">
                <section className="img-box">
                    <Link href={`/blogs/${blog.slug}`}>
                        <img className="img img-fluid" style={{ height: '300px', width: '100%' }} src={`${host}/blog/photo/${blog.slug}`} alt={blog.title} />
                    </Link>
                </section>
                <div className="content">
                    <div className="card-body">
                        <section>
                            <Link href={`/blogs/${blog.slug}`}>
                                <h5 className="card-title">{blog.title}</h5>
                            </Link>
                            <div className="card-text">{renderHTML(blog.excerpt)}</div>
                        </section>
                    </div>
                    <div className="card-body">
                        Posted {moment(blog.updatedAt).fromNow()} by{' '}
                        {/* style={{ textDecoration: 'none' }} remove underline from blog.postedBy.name */}
                        <Link className="float-right" href={`/profile/${blog.postedBy.username}`} style={{ textDecoration: 'none' }}>{blog.postedBy.username}</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default SmallCard