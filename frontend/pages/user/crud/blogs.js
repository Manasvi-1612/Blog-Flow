import Layout from "../../../components/Layout"
import Link from "next/link"
import Private from "../../../components/auth/Private"
import BlogRead from "../../../components/crud/BlogRead"
import { Auth } from "../../../actions/auth"

const Blogs = () => {

    const username = Auth() && Auth().username

    return (
        <Layout>
            <Private>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Blogs</h2>
                        </div>

                        <div className="col-md-12">
                            <BlogRead username={username}/>
                        </div>

                    </div>
                </div>
            </Private>
        </Layout>
    )
}
export default Blogs