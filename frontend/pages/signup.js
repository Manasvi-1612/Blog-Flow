import Link from "next/link"
import Layout from "../components/Layout"
import SignupComponent from "../components/auth/SignupComponent"
import Landing from "../components/Landing"
import { useRef } from "react"

const Signup = () => {

    const Headingref = useRef(null)
    
    return (
        <Layout>
            <div className="text-center pt-4 pb-4">
                <header className="Sub-Header">
                    <Landing>
                        <h2 ref={Headingref} className="heading">
                            <span>S</span>
                            <span>i</span>
                            <span>g</span>
                            <span>n</span>
                            <span> u</span>
                            <span>p</span>
                        </h2>
                    </Landing>
                </header>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignupComponent />
                </div>
            </div>
        </Layout>
    )
}
export default Signup