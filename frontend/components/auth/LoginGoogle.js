import { useEffect, useState } from 'react'
import Router from 'next/router'
import { loginWithGoogle, authenticate, Auth } from '../../actions/auth'
import { GOOGLE_CLIENT_ID } from '../../config'
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google'

const LoginGoogle = () => {

  const responseGoogle = async (response) => {
    console.log("response", response)
    const tokenId = response.credential
    const user = { tokenId }


    try {
      let data = await loginWithGoogle(user)

      console.log("data", data)
      authenticate(data, () => {
        if (Auth() && Auth().role === 1) {
          Router.push(`/admin`)
        } else {
          Router.push(`/user`)
        }
      })
    } catch (error) {
      console.log(error)
    }


  }


  return (
    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => console.log("error")}
      />
    </GoogleOAuthProvider>

  )
}

export default LoginGoogle