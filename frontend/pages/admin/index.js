import Layout from "../../components/Layout"
import Admin from "../../components/auth/Admin"
import Sidebar from "../../components/Sidebar"
import Dashboard from "../../components/admin/Dashboard"

const AdminIndex = () => {
    return (
        <Layout>
            <Admin>
                <Sidebar>
                    <Dashboard/>
                </Sidebar>
            </Admin>
        </Layout>
    )
}



export default AdminIndex