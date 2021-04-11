import React,{useState, useEffect} from 'react';
import {Link,useHistory } from 'react-router-dom';

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    useEffect(() => {
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
    
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","social-media")                 //name on cloudinary
            data.append("cloud_name","dbkmacv32")                            //profile name
            fetch("https://api.cloudinary.com/v1_1/dbkmacv32/image/upload",{        //api base url
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
               setUrl(data.url)
            })
            .catch(err=>{
                console.log(err)
            })    
    }

    const uploadFields = () => {
        fetch("/signup", {
            method:"post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({                                  //converting the creds from json to string
                name,
                email,
                password,
                pic:url
            }) 
        }).then(res=>res.json())                                     //converting the response back to json
        .then(data => {
            if(data.error){
                console.log(data.error)
            }
            else
            history.push("/signin")                                                          
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = () => {
        if(image){
            uploadPic()
        }
        else{
            uploadFields()
        }
    }

    return(

        <div class="card">
        <br></br><br></br>
        <h5 class="card-header">Login</h5>
        <div class="card-body">
        
        <p class="card-text">Name :</p>
        <input type="text" value={name} onChange = {(e)=>{setName(e.target.value)}}></input><br></br><br></br>
        <p class="card-text">Email Address :</p>
        <input type="text" value={email} onChange = {(e)=>{setEmail(e.target.value)}}></input><br></br><br></br>
        <p class="card-text">Password :</p>
        <input type="text" value={password} onChange = {(e)=>{setPass(e.target.value)}}></input><br></br><br></br>
        <div className="file-field input-field">
                 <div className="btn #64b5f6 blue darken-1">
                     <span>Upload Image</span>
                     <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                 </div> <div className="file-path-wrapper">
                     <input className="file-path validate" type="text" />
                 </div>
                 </div>
        <input type="text" value={password} onChange = {(e)=>{setPass(e.target.value)}}></input><br></br><br></br>
        <button class="btn btn-primary" onClick={() => PostData()}>Sign Up</button>
        <br></br> <br></br>
        <h4><Link to="/Signin">Already Have an Account? Login Here</Link></h4>
    
        
        </div>
        </div>
    )
}

export default Signup