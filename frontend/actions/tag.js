import fetch from "isomorphic-fetch";
const host = "http://localhost:8000/api"
import { handleResponse } from "./auth";

export const create = async (tag,token) => {

    try {

        const response = await fetch(`${host}/tag`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(tag)
        })
        
        handleResponse(response)
        const res = await response.json()

        // console.log(res)
        return res
    } catch (err) {
        console.log(err)
    }

}


export const getTags = async () => {
    try {
        const response = await fetch(`${host}/tags`, {
            method: 'GET',
        })
        const res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}


export const singleTag = async (slug) => {
    try {
        const response = await fetch(`${host}/tag/${slug}`, {
            method: 'GET',
        })
        const res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}

export const removeTag = async (slug,token) => {

    try {

        const response = await fetch(`${host}/tag/${slug}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        handleResponse(response)
        const res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }

}