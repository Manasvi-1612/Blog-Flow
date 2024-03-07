import Layout from "../../components/Layout"
import Link from "next/link"
import Private from '../../components/auth/Private'

const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <h2>UserIndex page</h2>

                <div className="col-md-4">
                        <ul className="list-group">
                            
                            <li className="list-group-item">
                                <Link className="nav-link active" href="/user/crud/blog">
                                    Create Blog
                                </Link>
                            </li>

                            <li className="list-group-item">
                                <Link className="nav-link active" href="/user/crud/blogs">
                                    Update/Delete Blog
                                </Link>
                            </li>

                            <li className="list-group-item">
                                <Link className="nav-link active" href="/user/update">
                                    Update profile
                                </Link>
                            </li>
                        </ul>
                    </div>

            </Private>
        </Layout>
    )
}
export default UserIndex