//protecting routes for logged in user
import Router from 'next/router'
import {Auth} from '../../actions/auth'
import { useEffect } from 'react'

const Private =({children}) =>{
  
  useEffect(()=>{
    
    if(!Auth()){
      Router.push(`/signin`)
    }
    
  },[])

  return (
    <>
      {children}
    </>
  )
}

export default Private
