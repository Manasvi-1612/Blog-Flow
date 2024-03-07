import fetch from "isomorphic-fetch";
const host = "http://localhost:8000/api"
import { handleResponse } from "./auth";

export const userPublicProfile = async (username) => {

    try {
        const data = await fetch(`${host}/user/${username}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            })
        const res = await data.json()
        return res

    } catch (err) {
        console.log(err)
    }

}

export const getProfile = async (token) => {

    try {
        const data = await fetch(`${host}/user/profile`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        const res = await data.json()
        return res

    } catch (err) {
        console.log(err)
    }

}

export const update = async (token, user) => {

    try {
        const data = await fetch(`${host}/user/update`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: user
            })

        handleResponse(data)
        const res = await data.json()
        return res

    } catch (err) {
        console.log(err)
    }

}

// export const photo = async (username) => {

//     try {
//         const data = await fetch(`${host}/user/photo/${username}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Accept: 'application/json'
//                 }
//             })
//         const res = await data.json()
//         return res

//     } catch (err) {
//         console.log(err)
//     }

// }
