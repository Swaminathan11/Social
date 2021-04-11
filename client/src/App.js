import React,{useEffect, createContext , useReducer, useContext} from 'react';
import Navbar from './components/navbar';
import { BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import Home from './components/screens/Home'
import Signin from './components/screens/signin'
import Signup from './components/screens/signup'
import Profile from './components/screens/profile'
import CreatePost from './components/screens/createpost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscriberUserPost from './components/screens/SubscribeUserPost'

export const UserContext = createContext()
const Routing = () => {                          
                                                                //switch makes sure only one of the paths is active at once
                                                                //since we have declared  usehistory here, we can make access the history of all the paths in order to see 
                                                                // if the user has the token or not. As we have wrapped everything into <Routing /> we make sure that
                                                                //the history can now be accessed from <BrwserRouter />
 const history = useHistory()
 const {state, dispatch} = useContext(UserContext)              //dispatch() calls the () when updation of state is required

 useEffect(() => {
   const user = JSON.parse(localStorage.getItem("user"))   //parse-convert from string back to object
   if(user) {                                              // this is true if user has token i.e authenticated
     dispatch({type: "USER",payload:user})                    //this calls the  reducer() in userReducer
   }      
   else{                                                        //else redirect to signin
     history.push('/signin')                 
   }
 }, [])                                      //empty dependency array, so this runs only on first render 
 return(
    <Switch>                                   
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/signin">
      <Signin />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Route exact path="/profile">
      <Profile />
    </Route>
    <Route path="/createPost">
      <CreatePost />
    </Route>
    <Route path="/profile/:userid">
      <UserProfile />
    </Route>
    <Route path="/myfollowerspost">
      <SubscriberUserPost />
    </Route>
    </Switch>
  )
}

function App() {
 
  const [state, dispatch] = useReducer(reducer, initialState)       //initially state is initailsed to initialState ie null

  return (
    // <userconext this line makes the state value accessible by all the routes under it
    // using createcontext
    <UserContext.Provider value={{state, dispatch}}> 
      <BrowserRouter>
    <Navbar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
    
    
  );
}

export default App;
