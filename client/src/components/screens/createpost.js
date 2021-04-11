import React,{useState, useEffect} from 'react';
import {Link,useHistory } from 'react-router-dom';
import M from 'materialize-css';
const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if(url){
            fetch("/createpost", {
                method:"post",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")      //sending jwt token as respone after signinh in
                 },
                body: JSON.stringify({                                  //converting the creds from json to string
    
                    title,
                    body,
                    pic:url
                }) 
            }).then(res=>res.json())                                     //converting the response back to json
            .then(data => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else
                {
                    M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"}) //pop up
                    history.push("/")                                   //once done navigate to main route
                }
                                                                     
            }).catch(err=>{
                console.log(err)
            })
        }
        },[url]) 

        const postDetails = ()=>{
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
        return(
            <div className="card input-filed">
                <input 
                type="text"
                 placeholder="title"
                 value={title}
                 onChange={(e)=>setTitle(e.target.value)}
                 />
                <input
                 type="text"
                  placeholder="body"
                  value={body}
                 onChange={(e)=>setBody(e.target.value)}
                  />
                <div className="file-field input-field">
                 <div className="btn #64b5f6 blue darken-1">
                     <span>Uplaod Image</span>
                     <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                 </div>
                 <div className="file-path-wrapper">
                     <input className="file-path validate" type="text" />
                 </div>
                 </div>
                 <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                 onClick={()=>postDetails()}
                 
                 >
                     Submit post
                 </button>
     
            </div>
        )
     }

export default CreatePost