import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import Router from 'next/router'

const host = "http://localhost:8000/api"

export const handleResponse = response => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: `/signin`,
                query: {
                    message: 'Your session is expired. Please signin'
                }
            })
        })
    } else {
        return;
    }
}

export const preSignup = async (user) => {

    try {

        const response = await fetch(`${host}/pre-signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const res = await response.json()

        // console.log("res",res)
        return res
    } catch (err) {
        console.log(err)
    }

}


export const signup = async (user) => {

    try {

        const response = await fetch(`${host}/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const res = await response.json()

        // console.log(res)
        return res
    } catch (err) {
        console.log(err)
    }

}

export const signin = async (user) => {

    try {

        const response = await fetch(`${host}/signin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const res = await response.json()

        return res
    } catch (err) {
        console.log(err)
    }

}

export const signout = async (next) => {

    try {
        removeCookie('token')
        removeLocalStorage('user')
        next();
        const response = await fetch(`${host}/signout`, {
            method: 'GET'
        })

        const res = await response.json()
        // console.log(res)
        // return res
    } catch (err) {
        console.log(err)
    }
}

//set/remove cookie
export const setCookie = (key, value) => {
    if (process.browser) {  //ensuring that we're running on client side
        cookie.set(key, value, {
            expires: 1
        })
    }
}

export const removeCookie = (key) => {
    if (process.browser) {  //ensuring that we're running on client side
        cookie.remove(key, {
            expires: 1
        })
    }
}

//get cookie
export const getCookie = (key) => {
    if (process.browser) {  //ensuring that we're running on client side
        return cookie.get(key)
    }
}

//localstorage - set, remove
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key)
    }
}

//authenticate user by pass to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token)
    setLocalStorage('user', data.user)
    next()
}

//check if user has token
export const Auth = () => {
    if (process.browser) {

        const cookieChecked = getCookie('token')

        if (cookieChecked) {
            if (localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined') {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
}

export const updateForm = (user, next) => {
    if (process.browser) {
        if (localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'))
            auth = user
            localStorage.setItem('user', JSON.stringify(auth))
            next()
        }
    }
}

export const forgotPassword = async (email) => {

    try {

        const response = await fetch(`${host}/forgot-password`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        })

        const res = await response.json()

        return res
    } catch (err) {
        console.log(err)
    }

}

export const resetPassword = async (resetInfo) => {

    try {

        const response = await fetch(`${host}/reset-password`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resetInfo)
        })

        const res = await response.json()

        return res
    } catch (err) {
        console.log(err)
    }

}

export const loginWithGoogle = async (user) => {
    // console.log("user",user)

    try {

        const response = await fetch(`${host}/google-login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
               
            },
            body: JSON.stringify(user)
        })

        const res = await response.json()

        // console.log("res", res)

        return res
    } catch (err) {
        console.log("err",err)
    }

}
