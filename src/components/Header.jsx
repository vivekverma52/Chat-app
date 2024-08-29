import {LogOut, LogIn} from 'react-feather'
import { useAuth } from '../utils/AuthContext'
import { Link } from 'react-router-dom'

const Header = () => {
    const {user, handleUserLogout} = useAuth()
  return (
    <div id="header--wrapper">
        {user ? (
            <>
            Welcome {user.name}
            <LogOut onClick={handleUserLogout} className="header--link"/>
            </>
        ): (
            <Link to="/">
              <LogIn className="header--link"/>
            </Link>
        )}
    </div>
  )
}

export default Header