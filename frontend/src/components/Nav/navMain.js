import React from 'react';
import {NavLink} from 'react-router-dom';
import  './MainNavigation.css';
import UserContext from '../../context/user-context';

const navMain = props =>(
    <UserContext.Consumer>
        {(context) =>{
            return (
                <header className = "main-navigation">
                <div className="main-navigation_logo">
                <h1>Blue Naartjie</h1>
                </div>
                <nav className ="main-navigation_item">
                    <ul>
                       {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                        <li><NavLink to="/events">Events</NavLink></li>
                        {context.token && (
                            <React.Fragment>
                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                        <li>
                            <button onClick = {context.logout}>Logout</button>
                        </li>
                        </React.Fragment>)}
                        <li><NavLink to="/bookRoom">Room Booking</NavLink></li>
                        <li><NavLink to="/CodingChallenge">Coding Challenge</NavLink></li>
                    </ul>
                </nav>
            </header>
            )
        }}
   
    </UserContext.Consumer>
);

export default navMain;