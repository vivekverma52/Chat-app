import { useEffect, useState } from "react"
import { useAuth } from "../utils/AuthContext"
import { useNavigate, Link } from "react-router-dom"


const LoginPage = () => {
  const {user , handleUserLogin} = useAuth()
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      navigate('/')
    }

  }, [])

  const handleInputChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setCredentials({...credentials, [name]: value})
    
  }


  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => { handleUserLogin(e, credentials)}}>  
          <div className="field--wrapper">
            <label>Email</label>
            <input 
            type="email" 
            required
            name="email"
            placeholder="Enter your email address"
            value={credentials.email}
            onChange = {handleInputChange}
          />
          </div>
          <div className="field--wrapper">
            <label>Password</label>
            <input 
            type="password" 
            required
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange = {handleInputChange}
          />
          </div>
          <div className="field--wrapper">
            <input type="submit" value="Login" className="btn btn--lg btn--main"/>
          </div>
        </form>
      <p>Do not have account ? Register <Link to="/register">Click here</Link></p>
        </div>
    </div>
  )
}

export default LoginPage
