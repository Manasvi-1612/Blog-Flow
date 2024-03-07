import Layout from '../../components/Layout'
import { singleTag } from '../../actions/tag'
import Card from "../../components/blog/Card"

const Tag = ({ tag, blogs }) => {
    return (
        <>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                                {blogs.map((blog, i) => {
                                    return (
                                        <article key={i} className='pt-3'>
                                            <Card blog={blog} />
                                            <hr />
                                        </article>
                                    )
                                })}
                                {/* {JSON.stringify(blogs)} */}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </>
    )
}

Tag.getInitialProps = async ({ query }) => {
    try {
        let data = await singleTag(query.slug)

        if (data.error) {
            console.log(data.error)
        } else {
            return {
                tag: data.tag,
                blogs: data.blogs
            }
        }
    } catch (error) {
        console.log(error)
        return {
            error
        }
    }
}


export default Tag