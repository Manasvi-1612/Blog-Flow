import { useRef, useState, useEffect } from "react"
import { getProfile } from '../../actions/user';
import { getCookie, Auth } from '../../actions/auth';
import { userPublicProfile } from "../../actions/user"
import moment from "moment"
import { async } from "regenerator-runtime";
import { lstBlogsCatsTags } from '../../actions/blog';

const Dashboard = () => {

    const Headingref = useRef(null)
    const host = 'http://localhost:8000/api'
    const [values, setValues] = useState({ id: '', error: '', createdAt: '', updatedAt: '' })
    const { id, error, createdAt, updatedAt } = values
    const token = getCookie('token')
    const [isAuth, setIsAuth] = useState()

    const [blogs, setBlogs] = useState()

    const init = async () => {
        try {
            let data = await getProfile(token)

            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    id: data._id,
                    createdAt: new Date(data.createdAt).toDateString(),
                    updatedAt: new Date(data.updatedAt).toDateString()
                })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }

    const recentBlog = async () => {
        try {
            let data = await lstBlogsCatsTags(0, 3)

            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data.blogs)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if (Auth()) {
            setIsAuth(true)
            console.log(Auth().name)
        }
        init()
        recentBlog()
    }, [])

    return (
        <>
            <div className="container d-flex text-light">
                {/* #3B3C41 */}
                <div className="rounded" style={{ marginTop: '80px', marginLeft: '40px', height: '80vh', width: '50vh', background: '#26272C' }}>
                    <div>
                        <img src={`${host}/user/photo/${id}`} alt="" className="rounded" style={{ margin: '10% 35%', width: '15vh', height: '15vh' }} />
                        <div className='text-center' style={{ marginTop: '-25px' }}>{isAuth && Auth().name}</div>
                    </div>

                    <div className="mt-5 mx-2">
                        <div className="h6">Personal Information</div>

                        <div style={{ fontSize: '.9rem', color: 'GrayText' }}><cite>Username</cite></div>
                        <div className="rounded" style={{ background: "#3B3C41", width: '90%' }}>
                            <div className="mx-2">{isAuth && Auth().username}</div>
                        </div>
                        <br />
                        <div style={{ fontSize: '.9rem', color: 'GrayText' }}><cite>Email ID</cite></div>
                        <div className="rounded" style={{ background: "#3B3C41", width: '90%' }}>
                            <div className="mx-2">{isAuth && Auth().email}</div>
                        </div>
                        <br />

                        <div className="expj">
                            <div className="d-flex">
                                <div className="ball"></div>
                                <div className="mx-2" style={{ fontSize: '.9rem', color: 'GrayText' }}><cite>First Login</cite></div>
                            </div>

                            <div className="d-flex">
                                <div className="mx-1 vertical-line"></div>
                                <div className="mx-3">{createdAt}</div>
                            </div>


                            <div className="d-flex">
                                <div className="ball"></div>
                                <div className="mx-2" style={{ fontSize: '.9rem', color: 'GrayText' }}><cite>Last Login</cite></div>
                            </div>

                            <div className="d-flex">
                                <div className="mx-1 vertical-line"></div>
                                <div className="mx-3">{updatedAt}</div>
                            </div>

                            <div className="d-flex">
                                <div className="ball"></div>
                                <div className="mx-2" style={{ fontSize: '.9rem', color: 'GrayText' }}><cite>Account Age</cite></div>
                            </div>
                            <div className="mx-3">{moment(createdAt).fromNow()}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="container rounded mb-4" style={{ marginTop: '80px', marginLeft: '60px', height: '35vh', width: '110vh', background: '#26272C' }}>
                    </div>

                    <div className="container rounded" style={{ marginLeft: '60px', height: '40vh', width: '110vh', background: '#26272C' }}>
                        <div className="pb-3 pt-3" style={{ color: 'GrayText' }}>Recent Post</div>
                        {blogs &&
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date & time</th>
                                        <th scope="col">Post</th>
                                        <th scope="col">Author</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{new Date(blogs[0].createdAt).toDateString()}</td>
                                        <td>{blogs[0].title}</td>
                                        <td>{blogs[0].postedBy.username}</td>
                                    </tr>
                                    <tr>
                                        <td>{new Date(blogs[1].createdAt).toDateString()}</td>
                                        <td>{blogs[1].title}</td>
                                        <td>{blogs[1].postedBy.username}</td>
                                    </tr>
                                    <tr>
                                        <td>{new Date(blogs[2].createdAt).toDateString()}</td>
                                        <td>{blogs[2].title}</td>
                                        <td>{blogs[2].postedBy.username}</td>
                                    </tr>
                                </tbody>
                            </table>}

                    </div>
                </div>

            </div>


        </>
    )
}

export default Dashboard