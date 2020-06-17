import React, {Component} from 'react';
import './Auth.css'
import UserContext from '../context/user-context';

class AuthenticationPage extends Component {
   state = {
       isLogin: true
   }

   static contextType = UserContext;

    constructor(props){
       super(props);
       this.elementEmail = React.createRef();
       this.elementPassword = React.createRef();
    }

    switchHandler = () => {
        this.setState(prevState =>{
            return {isLogin: !prevState.isLogin};
        })
    }

    submitHandler = (event) =>{
        event.preventDefault();
        const email = this.elementEmail.current.value;
        const password = this.elementPassword.current.value;

        if(email.trim().length===0 || password.trim().length ===0)
        {
            return;
        }
        let requestBody = {
            query:`
            query{
                login(email:"${email}",password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
            `
        };

        if(!this.state.isLogin)
        {
            requestBody ={
                query: `
                mutation {
                    createUser(userInput:{email: "${email}", password: "${password}"}){
                        _id
                        email
                    }
                }
                `
            };
        }
      

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': "application/json"
            }
        })
        .then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData =>{
            if(resData.data.login.token){
                this.context.login(
                    resData.data.login.token, 
                    resData.data.login.userId, 
                    resData.data.tokenExpiration)
            }
        })
        .catch(err =>{
            console.log(err);
        });
    };

    render(){
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <legend className= "auth-legend">{this.state.isLogin ? 'Login' : 'Sign Up'}</legend>
            <fieldset>
            <div className ="form-container">
                <label htmlFor="email"><b>Email</b></label>
                <input type ="email" id="email" placeholder = "Enter an email" required ref={this.elementEmail}/>
            </div>
            <div className ="form-container">
                <label htmlFor="password"><b>Password</b></label>
                <input type ="password" id="password" placeholder=" Enter a password" required ref={this.elementPassword}/>
            </div>
            <div className ="form-buttons">
                <button type="button" onClick={this.switchHandler}>
                    Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}
                </button>
                <button type="submit">
                    Submit
                </button>
                <button type="reset">
                    Clear
                </button>
            </div>
            </fieldset>
        </form>;
    }
}

export default AuthenticationPage;