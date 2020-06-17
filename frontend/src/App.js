import React,{Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import MainNavigation from './components/Nav/navMain'
import AuthenticationPage from './Pages/Auth';
import EventPage from './Pages/Events';
import BookingPage from './Pages/Bookings';
import CodingChallengePage from './Pages/CodingChallenge'
import UserContext from './context/user-context';
import './App.css';
import bookRoom from './Pages/bookRoom';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) =>{
    this.setState({
      token: token,
      userId: userId
    });
  }

  logout = () =>{
    this.setState({
      token: null,
      userId: null
    });
  }
render(){
  return (
    <BrowserRouter>
    <React.Fragment>
      <UserContext.Provider value={{
        token: this.state.token,
        userId: this.state.userId,
        login: this.login,
        logout: this.logout
        }}>
      <MainNavigation/>
        <main className="main-content">
          <Switch>
            {<Route path="/bookRoom" component={bookRoom}/>}
          {!this.state.token && <Redirect from="/" to="/auth" exact/>}
          {!this.state.token && <Redirect from="/bookings" to="/auth" exact/>}
            {this.state.token && <Redirect from="/auth" to="/events" exact/>}
            {!this.state.token && (<Route path="/auth" component={AuthenticationPage}/>)}
            <Route path="/events" component={EventPage}/>
  {this.state.token && (<Route path="/bookings" component={BookingPage}/>)}
  {<Route path="/CodingChallenge" component={CodingChallengePage}/>}
          </Switch>
       </main>
       </UserContext.Provider>
       </React.Fragment>
    </BrowserRouter>
  );
      
}
}
export default App;
