import Link from "next/link"
import Layout from "../components/Layout"
import ContactForm from "../components/form/ContactForm"
import Landing from "../components/Landing"
import { useRef } from "react"

const Contact = () => {

    const Headingref = useRef(null)

    return (
        <Layout>
            <div className="container-fluid my-4">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <header className="Sub-Header">
                            <Landing>
                                <h2 ref={Headingref} className="heading">
                                    <span>C</span>
                                    <span>o</span>
                                    <span>n</span>
                                    <span>t</span>
                                    <span>a</span>
                                    <span>c</span>
                                    <span>t</span>
                                    <span> F</span>
                                    <span>o</span>
                                    <span>r</span>
                                    <span>m</span>
                                </h2>
                            </Landing>
                        </header>
                        <hr />
                        <ContactForm />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default Contact