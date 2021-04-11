import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from "../../App"
import {useParams} from 'react-router-dom'  //to access the parameter from App.js 
const Profile = () => {
    const [userProfile,setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
   // console.log(state)
   
    
    
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)    
            setProfile(result)     
        })
    }, [])
    
    const followUser = () => {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{

            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=> {
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
    return(
        <>{userProfile ?                  //if userprofile available show or show laoding...
            <div>
            <br></br>
            <br></br>
            <div><img style={{width:"200px",height:"200px"}} 
            src={userProfile.user.pic} alt="No display available" /></div>
            <br></br>
            <br></br>
            <div>
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.email}</h5>
                <div>
                    <h6>{userProfile.posts.length} Posts</h6>
                    <br></br>
                    
                    <h6>{userProfile.user.followers.length} Followers</h6>
                    <br></br>
                    <h6>{userProfile.user.following.length} Following</h6>
                </div><br></br>
                {showfollow?
                <button class="btn btn-primary" onClick={() => followUser()}>Follow</button>
                :
                <button class="btn btn-primary" onClick={() => unfollowUser()}>Unfollow</button>
                }
            </div><br></br>
            <div className="gallery">
                {
                  userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" style={{width:"300px",height:"300px"}} 
                            src={item.photo} alt="No diaplay" />
                        )
                    })
                }
            </div>
            
            </div> :
        <h2>Loading...</h2>}
        
        </>
        
    )
}

export default Profile