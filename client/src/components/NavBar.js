import '../stylesheets/NavBar.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Notification from './Notification.js';

export default function NavBar(props) {
  const changeActive = props.changeActive;
  const enterPressed = (e) => {
    if(e.key === 'Enter') {
      changeActive("Search");
      // changes searchString's state in App
      props.handleSearch(e.target.value);
    }
  };
  
  // pop-up notification with relevant message is shown using state
  const [showNotif, setShowNotif] = useState(false);
  const closeNotif = () => {
    setShowNotif(false);
  }

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  // check if the user is logged in every time the activePage changes
  useEffect(() => {
    axios.get("http://localhost:8000/getLoggedIn")
      .then(response => {
        setIsLoggedIn(response.data.loggedIn);
      })
      .catch(error => {
        console.error('Error getting logged in', error);
      });
  },[props.activePage]);
  
  // use axios to end session
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout");
      setIsLoggedIn(false);
      setShowNotif(true);
    }
    catch(error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
    <ul id="navbar">
      <li>
        <button id="header-title" className="header-title" onClick={() => {changeActive("Welcome")}}>
          fake<b>StackOverflow</b>
        </button>
      </li>
      <li>
        <button className="nav-link" onClick={() => props.changeActive("Questions")}>
          Questions
        </button>
      </li>
      <li>
        <button className="nav-link" onClick={() => props.changeActive("Tags")}>
          Tags
        </button>
      </li>
      <li>
        <input id="search" type="text" placeholder="Search . . ." onKeyDown={enterPressed} />
      </li>
      <li className="nav-buttons">
      {isLoggedIn ? (
        <>
          <button className="white-button" onClick={() => {changeActive("UserProfile")}}>Profile</button>
          &nbsp;
          <button className="white-button" onClick={() => {handleLogout(); changeActive("Welcome");}}>Logout</button>
        </>
      ) : (
        <>
          <button className="white-button" onClick={() => {changeActive("Login")}}>Log in</button>
          &nbsp;
          <button className="blue-button" onClick={() => {changeActive("Register")}}>Sign up</button>
        </>
      )}
      </li>
    </ul>
    {showNotif && 
      <Notification message="You have been logged out" onClose={closeNotif}/>
    }
    </>
  );
}