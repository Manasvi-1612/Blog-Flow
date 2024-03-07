import Layout from "../../components/Layout"
import Private from "../../components/auth/Private"
import ProfileUpdate from "../../components/auth/ProfileUpdate"
import { getProfile } from "../../actions/user"
import { getCookie } from '../../actions/auth'

const UserProfileUpdate = () => {

    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <ProfileUpdate/>
                        {/* {JSON.stringify(userId)} */}
                    </div>
                </div>
            </Private>
        </Layout>
    )
}



export default UserProfileUpdate