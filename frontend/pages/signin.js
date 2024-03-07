import Link from "next/link"
import Layout from "../components/Layout"
import SigninComponent from "../components/auth/SigninComponent"
import { withRouter } from "next/router"
import Landing from "../components/Landing"
import { useRef } from "react"

const Signin = ({ router }) => {

    const Headingref = useRef(null)

    const showRedirectMsg = () => {
        if (router.query.message) {
            return (
                <div className="alert alert-danger">
                    {router.query.message}
                </div>
            )
        } else {
            return;
        }
    }
    return (

        <Layout >
            <div className="text-center pt-4 pb-4">
                <header className="Sub-Header">
                    <Landing>
                        <h2 ref={Headingref} className="heading">
                            <span>S</span>
                            <span>i</span>
                            <span>g</span>
                            <span>n</span>
                            <span> i</span>
                            <span>n</span>
                        </h2>
                    </Landing>
                </header>
            </div>

            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {showRedirectMsg()}
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 offset-md-3">
                    < SigninComponent />
                </div>
            </div>
        </Layout>

    )
}


export default withRouter(Signin)