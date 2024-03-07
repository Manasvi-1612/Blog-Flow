import Layout from "../../../components/Layout"
import Link from "next/link"
import Admin from "../../../components/auth/Admin"
import BlogCreate from "../../../components/crud/BlogCreate"
import Landing from "../../../components/Landing"
import { useRef } from "react"

const Blog = () => {
    const Headingref = useRef(null)
    
    return (
        <Layout>
            <Admin>
                <div className="row">
                    <div className="col-md-12 pt-5 pb-5">
                        <header className="Sub-Header">
                            <Landing>
                                <h2 ref={Headingref} className="heading">
                                    <span>C</span>
                                    <span>r</span>
                                    <span>e</span>
                                    <span>a</span>
                                    <span>t</span>
                                    <span>e</span>
                                    <span> B</span>
                                    <span>l</span>
                                    <span>o</span>
                                    <span>g</span>
                                </h2>
                            </Landing>
                        </header>
                    </div>

                    <div className="col-md-12">
                        <BlogCreate />
                    </div>

                </div>

            </Admin>
        </Layout>
    )
}
export default Blog