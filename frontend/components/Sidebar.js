import React, { useState, useEffect } from 'react';
import {
    FaTh,
    FaFont,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaTags,
    FaPen,
    FaCommentAlt,
    FaShoppingBag,
    FaList
} from "react-icons/fa";
import Link from "next/link"
import { getProfile } from '../actions/user';
import { getCookie } from '../actions/auth';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/user/update",
            name: "Profile",
            icon: <FaUserAlt />
        },
        {
            path: "/admin/crud/category-tag",
            name: "Categories",
            icon: <FaList />
        },
        {
            path: "/admin/crud/category-tag",
            name: "Tags",
            icon: <FaTags />
        },
        {
            path: "/admin/crud/blog",
            name: "New_Blog",
            icon: <FaFont />
        },
        {
            path: "/admin/crud/blogs",
            name: "Update/Delete",
            icon: <FaPen />
        }
    ]
    const host = 'http://localhost:8000/api'

    const token = getCookie('token')
    const [values, setValues] = useState({ id: '', error: '' })
    const { id, error } = values

    const init = async () => {
        try {
            let data = await getProfile(token)

            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    id: data._id,
                })
            }
        } catch (error) {
            setValues({ ...values, error })
        }
    }
    useEffect(() => {
        init()
    }, [])

    return (
        <div className="container Sidecontainer" style={{ height: '100vh', position: 'fixed' }}>
            <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Welcome,</h1>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                <div className='d-flex'>
                    <img src={`${host}/user/photo/${id}`}
                        className="mx-2 mb-2 d-block" style={{ width: isOpen ? '15vh' : '5vh', height: isOpen ? '15vh' : '5vh', borderRadius: '50%' }}
                        alt="Avatar" />
                </div>
                <div className='mt-3'>
                    {menuItem.map((item, index) => (
                        <Link href={item.path} key={index} className="link container" activeclassname="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;