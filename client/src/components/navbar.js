import React, {useContext} from 'react';
import {Link, useHistory } from 'react-router-dom'; 
import { UserContext } from '../App';

const Navbar = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const renderList = () => {
      if(state){
        return [
          <li className="nav-item">
          <Link className="nav-link" to="/Profile">Profile</Link>
          </li>,
          <li className="nav-item">
          <Link className="nav-link" to="/createPost">Create Post</Link>
          </li>,
          <li className="nav-item">
          <Link className="nav-link" to="/myfollowerspost">My following Posts</Link>
          </li>,
          <li className="nav-item">
          <button class="btn btn-primary" onClick={() => {
            localStorage.clear()                //for logout clear jwt token in localstorage and redirect to signin
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}>Log Out</button>
          </li>
        ]
      }else{
        return [
          <li className="nav-item active">
        <Link className="nav-link" to="/Signin">Sign In<span className="sr-only">(current)</span></Link>
      </li>,
      <li className="nav-item">
        <Link className="nav-link" to="/Signup">Sign Up</Link>
      </li>
        ]
      }
    }
    


    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to={state?"/":"/signin"}>Navbar</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {renderList()}
        </div>
        </nav>
    )
}

export default Navbar;