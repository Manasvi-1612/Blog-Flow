import { useEffect, useState } from 'react';
import { APP_NAME } from '../config'
import Link from 'next/link';
import Router from 'next/router';
import nProgress from 'nprogress';

import { Auth, signout } from '../actions/auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';

Router.onRouteChangeStart = url => nProgress.start()
Router.onRouteChangeComplete = url => nProgress.done()
Router.onRouteChangeError = url => nProgress.done()

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);


  const [isAuth, setIsAuth] = useState(false)

  const [show, setShow] = useState(true)

  useEffect(() => {
    if (Auth()) {
      setIsAuth(true)
    }

    let topScroll = 0;
    let navbar = document.getElementById('Navbar')
    window.addEventListener("scroll", () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop
      if (scrollTop > topScroll) {
        setShow(false)
      } else {
        setShow(true)
      }
      topScroll = scrollTop;
    })

  }, [])

  return (
    <div className='pb-5'>
      <Navbar id='Navbar' dark expand='md' fixed="top" style={{ opacity: show ? '' : '0.4' }}>
        <Link className='navbar-brand active' href="/">{APP_NAME}</Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto mx-4" navbar>

            <>
              <NavItem>
                <Link className="nav-link active" href="/blogs">
                  Blogs
                </Link>
              </NavItem>

              <NavItem>
                <Link className="nav-link active" href="/contact">
                  Contact
                </Link>
              </NavItem>
            </>


            {isAuth ? (
              <NavItem>
                <Link onClick={() => signout(() => Router.replace(`/signin`))} className="nav-link active" href="/signin">
                  Signout
                </Link>
              </NavItem>
            ) : (
              <>
                <NavItem>
                  <Link className="nav-link active" href="/signin">
                    Signin
                  </Link>
                </NavItem>

                <NavItem>
                  <Link className="nav-link active" href="/signup">
                    Signup
                  </Link>
                </NavItem>
              </>)}

            {isAuth && Auth().role === 0 && (
              <NavItem>
                <Link className="nav-link active" href="/user">
                  {`${Auth().username}'s Dashboard`}
                </Link>
              </NavItem>
            )}

            {isAuth && Auth().role === 1 && (
              <NavItem>
                <Link className="nav-link active" href="/admin">
                  {`${Auth().name}'s Dashboard`}
                </Link>
              </NavItem>
            )}

            {isAuth && Auth().role === 1 ? (
              <NavItem>
                <Link className="nav-link active" href="/admin/crud/blog">
                  Write a blog
                </Link>
              </NavItem>
            ):(
              <NavItem>
                <Link className="nav-link active" href="/user/crud/blog">
                  Write a blog
                </Link>
              </NavItem>
            )}

          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;