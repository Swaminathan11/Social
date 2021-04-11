import React,{useState, useContext} from 'react';
import {Link,useHistory } from 'react-router-dom';
import {UserContext} from '../../App'

const Signin = () => {

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const PostData = () => {
        fetch("/signin", {
            method:"post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({                                  //converting the creds from json to string

                email,
                password
            }) 
        }).then(res=>res.json())                                     //converting the response back to json
        .then(data => {
            if(data.error){
                console.log(data.error)
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                history.push("/")
            }
                                                                  
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        
        <div class="card">
        <br></br><br></br>
        <h5 class="card-header">Login</h5>
        <div class="card-body">
        
        <p class="card-text">Email Address :</p>
        <input type="text"  value={email} onChange = {(e)=>{setEmail(e.target.value)}}></input><br></br><br></br>
        <p class="card-text">Password :</p>
        <input type="text"  value={password} onChange = {(e)=>{setPass(e.target.value)}}></input><br></br><br></br>
        
        <br></br> <br></br>
        <h4><Link to="/Signup">Dont have an account? Sign Up</Link></h4>
        </div>
        </div>
    )
}

export default Signin