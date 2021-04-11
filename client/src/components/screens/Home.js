//usecontext to get deets of user who is logged in currently
import React, {useState,useEffect, useContext} from 'react';
import "../../App.css"
import {UserContext} from "../../App"
import {Link} from 'react-router-dom'
const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)  //state had deets of user who has logged in

    useEffect(() => {
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }   
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                  console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

  const unlikePost = (id)=>{
    fetch('/unlike',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
      //   console.log(result)
      const newData = data.map(item=>{
          if(item._id==result._id){    //if record has been updated
              return result
          }else{
              return item
          }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err)
  })
}

const makeComment = (text,postId)=>{
    fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
       })
      setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}

//no content type and body becaz no response is sent as it not post ot put

const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{       //filtering out deleted record
            return item._id !== result._id        //return only those which aint deleted
        })
        setData(newData)
    })
}

    return(
        <div>
            {data.map(item=>{
                return(
                    <div className="card" key={item._id}>
                        <br></br><br></br>
                        <h5 style={{padding:"5px"}}>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile" } > 
                                
                                {item.postedBy.name}</Link> {item.postedBy._id == state._id 
                            && <i className="material-icons" 
                            onClick={()=>deletePost(item._id)}
                            >delete</i>

                            }</h5>
                    <img className="card-img-top uploaded-photo" src={item.photo} alt="Card cap"></img>
                    <div className="card-body">
                        <div class="like">
                       
                        {item.likes.includes(state._id)
                        ?
                        <button>
                        <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                        </button>
                        :
                        <button>
                        <i className="material-icons" onClick={()=>{likePost(item._id)}}>thumb_up</i>
                        </button>
                        }
                        <h6>{item.likes.length} likes</h6>
                        </div>
                    
                    <h6 className="card-title">{item.title}</h6>
                    <p className="card-text">{item.body}</p>
                    {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                  <input type="text" placeholder="add a comment" />  
                                </form>
                    </div>
                    </div>
                )
            })}
            
        </div>
    )
}

export default Home