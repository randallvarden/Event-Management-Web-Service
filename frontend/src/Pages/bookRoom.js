import React, {Component} from 'react';
import UserContext from '../context/user-context';
import Spinner from '../components/Spinner/Spinner';
import './bookRoom.css'

class bookRoom extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list',
        bookingNumber:'',
        roomBooking:[],
        roomBooking:{
            id: '',
            dateFrom: '',
            dateTo:'',
            customerId:'',
            staffId:'',
            Customer:'',
            Staff:''
        }
    };

    static contextType = UserContext;

    getBooking =_ =>
    {
        const {bookingNumber} = this.state;
        fetch("https://cors-anywhere.herokuapp.com/" +'http://mabhena-api.ki-solutions.co.za/Api/Booking/'+bookingNumber,
        {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers':"Origin, X-Requested-With, Content-Type, Accept"
            }
        }).then(Response => Response.json())
    }

    makeBooking =_ =>
    {
        const {roomBooking} = this.state;
        fetch("https://cors-anywhere.herokuapp.com/" +'http://mabhena-api.ki-solutions.co.za/Api/Booking',
        {
            method: 'POST',
            body: JSON.stringify(roomBooking),
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers':"Origin, X-Requested-With, Content-Type, Accept"
            }
        })
    }

   
    render(){
        const {roomBooking} = this.state;
        const {bookingNumber} = this.state;
        let content = <Spinner/>;
        if(!this.state.isLoading){
            content = (
                <React.Fragment>
                    <div className="button-center">
                    <div className = "form-buttons">
                    <form className = "form-control">
                     <h3>Booking Number: </h3>   <input value = {bookingNumber} onChange ={e => this.setState({bookingNumber: e.target.value})} ></input>
                    </form>
                    <br></br>
                    <button className="button-center" onClick = {this.getBooking} >Get Booking</button>
                <form className ="form-control">
                     <h3>ID: </h3>   <input value = {roomBooking.id}  onChange ={e => this.setState({roomBooking:{...roomBooking, id: e.target.value}})} />
                     <h3>Room: </h3>   <input value = {roomBooking.room} onChange ={e => this.setState({roomBooking:{...roomBooking, room: e.target.value}})}/>
                     <h3>Date From: </h3>   <input type ="date" value = {roomBooking.dateFrom} onChange ={e => this.setState({roomBooking:{...roomBooking, dateFrom: e.target.value}})} />
                     <h3>Date To: </h3>   <input type ="date" value = {roomBooking.dateTo} onChange ={e => this.setState({roomBooking:{...roomBooking, dateTo: e.target.value}})} />
                     <h3>Customer ID: </h3>   <input value = {roomBooking.customerId} onChange ={e => this.setState({roomBooking:{...roomBooking, customerId: e.target.value}})} />
                     <h3>Staff ID: </h3>   <input value = {roomBooking.staffId} onChange ={e => this.setState({roomBooking:{...roomBooking, staffId: e.target.value}})} />
                     
                </form>
                <br></br>
                <button onClick = {this.makeBooking} > Book Room</button>
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

export default bookRoom;
