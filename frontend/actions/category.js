import fetch from "isomorphic-fetch";
const host = "http://localhost:8000/api"
import { handleResponse } from "./auth";

export const create = async (category,token) => {

    try {

        const response = await fetch(`${host}/category`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(category)
        })

        handleResponse(response)

        const res = await response.json()

        // console.log(res)
        return res
    } catch (err) {
        console.log(err)
    }

}


export const getCategories = async () => {
    try {
        const response = await fetch(`${host}/categories`, {
            method: 'GET',
        })
        const res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}


export const singleCategory = async (slug) => {
    try {
        const response = await fetch(`${host}/category/${slug}`, {
            method: 'GET',
        })
        const res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}

export const removeCategory = async (slug,token) => {

    try {

        const response = await fetch(`${host}/category/${slug}`, {
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