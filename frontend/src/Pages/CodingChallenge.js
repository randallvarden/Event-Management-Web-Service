import React, {Component} from 'react';
import UserContext from '../context/user-context';
import Spinner from '../components/Spinner/Spinner';
import './bookRoom.css'

class CodingChallenge extends Component {
    state = {
        isLoading: false,
        outputType: 'list',
        bookingNumber:'',
        Name:'Randall Varden',
        Email:'randall.varden@gmail.com',
        arrayData:[""],
        result:'',
        Token:''
    };

    static contextType = UserContext;

    makeRequest =_ =>
    {
        const {Name} = this.state;
        const {Email} = this.state;
        const {Token} = this.state;
        const {arrayData} = this.state;
        const requestBody ={
          fullName: "Randall Varden",
          email: "randall.varden@gmail.com"
        };

        fetch("https://cors-anywhere.herokuapp.com/"+'https://challenge.andile.net/login',
        {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers':"Origin, X-Requested-With, Content-Type, Accept"
            }
        }).then(Response => Response.json()).then(Response =>
            {
                console.log("the Token is by first response: "+Response.token);
                this.setState({Token: Response.token});
                this.setState({arrayData: Response.data})
                console.log("TOKEN 2: "+Token);
                console.log("STATE DATA"+arrayData);
               if(Response.challenge ==="SORTING")//FIBONACCI
               {
                  this.validateAnswer(this.bubbleSort(Response.data));
               }
               else{
                this.validateAnswer(this.fibonacciResolve(Response.data));
               }
            }
        )}

    validateAnswer = _=>
    {
        const {result} = this.state;
        const {Token} = this.state;
        console.log("the Token is: "+Token);

        const requestBody = {
            token: Token,
            result: result
        };
        console.log(requestBody);
        fetch("https://cors-anywhere.herokuapp.com/" +'https://challenge.andile.net/validate',
        {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers':"Origin, X-Requested-With, Content-Type, Accept",
               'Authorization' : 'Bearer ' + Token
            }
        }).then(Response => Response.json())
    }

    bubbleSort = _=>
    {
        const {result} = this.state;
        var {arrayData} = this.state;
        console.log("array Data: " + arrayData)
        var sortedArray =[];
        for(var key in arrayData)
        {
            sortedArray.push(arrayData[key]);
       }
       console.log("after for loop:"+sortedArray.sort())
        var sA =sortedArray.sort();
        this.setState({result: sA});
        console.log("result value at this point: "+ result)
        return result;
    }

    fibonacciResolve =_=>
    {
        var {arrayData} = this.state;
        var {result} = this.state;
        var num =arrayData;
        var a = 0;
        var b = 1;
        var c =0;
        if(num == 0)
        {
            result=a;
            return result;
        }
        for(var i = 2; i<=num; i++)
        {
            c = a+b;
            a=b;
            b=c;
        }
        this.setState({result: b});
        //result.setState ={b};
        return result;
    }

    testAPI = _=>
    {
        fetch("https://cors-anywhere.herokuapp.com/" +'https://challenge.andile.net/test',
        {
            method: 'POST',
           // body: JSON.stringify(""),
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers':"Origin, X-Requested-With, Content-Type, Accept",
            }
        }).then(Response => Response.json())
    }
        
    

   
    render(){
        const {email} = this.state;
        const {name} = this.state;
        let content = <Spinner/>;
        if(!this.state.isLoading){
            content = (
                <React.Fragment>
                    <div className="button-center">
                    <div className = "form-buttons">
                <form className ="form-control">
                     <h3>Name: </h3>   <input value = {name}  onChange ={e => this.setState({name:e.target.value})} />
                     <h3>Email: </h3>   <input value = {email} onChange ={e => this.setState({email: e.target.value})}/>
                </form>
                <br></br>
                <button onClick = {this.makeRequest} > Send</button>
                </div>
                </div>
                </React.Fragment>
            );
        
        return (
            <React.Fragment>
              {content}
       
        </React.Fragment>
        );
                     }
    }

}

export default CodingChallenge;
