import Layout from '../../components/Layout'
import { singleCategory } from '../../actions/category'
import Card from "../../components/blog/Card"

const Category = ({ category, blogs }) => {
    return (
        <>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{category.name} Blogs</h1>
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

Category.getInitialProps = async ({ query }) => {
    try {
        let data = await singleCategory(query.slug)

        if (data.error) {
            console.log(data.error)
        } else {
            return {
                category: data.category,
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


export default Category