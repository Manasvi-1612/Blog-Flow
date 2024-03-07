import Router from 'next/router'
import { Auth } from '../../actions/auth'
import { useEffect } from 'react'

const Admin = ({ children }) => {

  useEffect(() => {
    if (!Auth()) {
      Router.push(`/signin`)
    } else if (Auth().role !== 1) {
      Router.push(`/`)
    }

  }, [])

  return (
    <>
      {children}
    </>
  )
}

export default Admin