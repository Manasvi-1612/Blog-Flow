import fetch from "isomorphic-fetch";
const host = "http://localhost:8000/api"
import queryString from 'query-string';
import { Auth, handleResponse } from './auth'

export const createBlog = async (blog, token) => {

    let url;
    if (Auth() && Auth().role === 1) {
        url = `${host}/blog`
    } else if (Auth() && Auth().role === 0) {
        url = `${host}/user/blog`
    }

    try {
        const data = await fetch(`${url}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: blog  //sending form-data
            })

        handleResponse(data)
        const res = await data.json()

        // // console.log("res "+res)
        return res

    } catch (err) {
        console.log(err)
    }

}


export const lstBlogsCatsTags = async (skip, limit) => {

    const data = {
        limit,
        skip
    }

    try {
        const result = await fetch(`${host}/blogs-categories-tags`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        const res = await result.json()

        // // console.log("res "+res)
        return res

    } catch (err) {
        console.log(err)
    }

}

export const singleBlog = async (slug) => {
    try {
        const result = await fetch(`${host}/blog/${slug}`,
            {
                method: 'GET'
            })

        const res = await result.json()
        return res
    } catch (err) {
        console.log(err)
    }

}

export const listRelated = async (blog) => {
    try {
        const result = await fetch(`${host}/blogs/related`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(blog)
            })
        const res = await result.json()

        // // console.log("res "+res)
        return res

    } catch (err) {
        console.log(err)
    }

}

//Admin can see and update all the blogs (including the user)
export const list = async (username) => {

    let url;
    if (username) {
        url = `${host}/${username}/blogs`
    } else {
        url = `${host}/blogs`
    }

    try {
        const result = await fetch(`${url}`,
            {
                method: 'GET'
            })

        const res = await result.json()
        return res
    } catch (err) {
        console.log(err)
    }

}


export const removeBlog = async (slug, token) => {

    let url;
    if (Auth() && Auth().role === 1) {
        url = `${host}/blog/${slug}`
    } else if (Auth() && Auth().role === 0) {
        url = `${host}/user/blog/${slug}`
    }

    try {
        const data = await fetch(`${url}`,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

        handleResponse(data)
        const res = await data.json()

        return res

    } catch (err) {
        console.log(err)
    }

}

export const updateBlog = async (blog, token, slug) => {

    let url;
    if (Auth() && Auth().role === 1) {
        url = `${host}/blog/${slug}`
    } else if (Auth() && Auth().role === 0) {
        url = `${host}/user/blog/${slug}`
    }

    try {
        const data = await fetch(`${url}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: blog
            })
        handleResponse(data)
        const res = await data.json()

        console.log(res)
        return res

    } catch (err) {
        console.log(err)
    }

}

export const listSearch = async (params) => {

    console.log("params", params)
    let query = queryString.stringify(params)
    console.log("query", query)

    try {
        const result = await fetch(`${host}/blogs/search/?${query}`,
            {
                method: 'GET'
            })

        const res = await result.json()
        return res
    } catch (err) {
        console.log(err)
    }

}