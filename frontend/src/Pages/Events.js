import React, {Component} from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import UserContext from '../context/user-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner'

class EventPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
        isActive: true
    };   
    
    //isActive = true;

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.titleElementRef = React.createRef();
        this.priceElementRef = React.createRef();
        this.dateElementRef = React.createRef();
        this.descriptionElementRef = React.createRef();
    }

    componentDidMount(){
        this.fetchEvents();
    }

    createEventHandler = () =>{
        this.setState({creating: true});
    }

    modalconfirmHandler = () =>{
        this.setState({creating:false});
        const title = this.titleElementRef.current.value;
        const price = +this.priceElementRef.current.value;
        const date = this.dateElementRef.current.value;
        const description = this.descriptionElementRef.current.value;

        if(title.trim().length === 0 || 
        price<= 0 || 
        date.trim().length === 0 || 
        description.trim().length === 0)
        {
            return;
        }

        const event ={title, price, date, description};
        console.log(event);

      
          const requestBody ={
                query: `
                mutation {
                    createEvent(eventInput:{title: "${title}", description: "${description}", price:${price}, date:"${date}"}){
                        _id
                        title
                        description
                        date
                        price
                    }
                }
                `
            };
        
        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData =>{
           this.setState(previousState =>{
                const updatedEvents = [...previousState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId,
                    }
                });
                return {events: updatedEvents};
           });
        })
        .catch(err =>{
            console.log(err);
        });

    };

    modelcancelHandler = () =>{
        this.setState({creating:false, selectedEvent: null});
    }

    fetchEvents(){
        this.setState({isLoading:true});
        const requestBody ={
            query: `
            query {
                events{
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        _id
                        email
                    }
                }
            }
            `
        };

    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': "application/json",
        }
    })
    .then(res =>{
        if(res.status !== 200 && res.status !== 201){
            throw new Error('Failed!');
        }
        return res.json();
    }).then(resData =>{
       const events = resData.data.events;
       this.setState({
           isActive:true
       });
       if(this.state.isActive === true){
        this.setState({events: events, isLoading:false});
       }
       
    })
    .catch(err =>{
        console.log(err);
        this.setState({
            isActive:true
        });
        if(this.state.isActive === true){
            this.setState({isLoading:false});
        }
        
    });

};

showDetailHandler = eventId => {
    this.setState(previousState =>{
        const selectedEvent = previousState.events.find(e => e._id === eventId);
        return{selectedEvent: selectedEvent};
    })
}

bookEventHandler = () =>{
    if(!this.context.token){
        this.setState({
            selectedEvent: null
        });
        return;
    }
    const requestBody ={
        query: `
        mutation {
            bookEvent(eventId: "${this.state.selectedEvent._id}"){
                _id
                createdAt
                updatedAt
            }
        }
        `
    };

fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
        'Content-Type': "application/json",
        'Authorization' : 'Bearer ' + this.context.token
    }
})
.then(res =>{
    if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed!');
    }
    return res.json();
}).then(resData =>{
   console.log(resData)
   this.setState({selectedEvent: null});
 
})
.catch(err =>{
    console.log(err);
    this.setState({isLoading:false});
});

};

UNSAFE_componentWillMount(){
    this.isActive = false;
}

    render(){
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}
                {this.state.creating && (
                <Modal title="Add Event"
                canCancel 
                canConfirm 
                onCancel={this.modelcancelHandler} 
                onConfirm={this.modalconfirmHandler}
                confirmWord = "Confirm"
                >
                    <form>
                        <div className="form-container">
                            <label htmlFor= "title">Title</label>
                            <input type="text" id="title" ref = {this.titleElementRef}></input>
                        </div>
                        <div className="form-container">
                            <label htmlFor= "price">Price</label>
                            <input type="number" id="price" ref ={this.priceElementRef}></input>
                        </div>
                        <div className="form-container">
                            <label htmlFor= "date">Date</label>
                            <input type="datetime-local" id="date" ref ={this.dateElementRef}></input>
                        </div>
                        <div className="form-container">
                            <label htmlFor= "description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionElementRef}></textarea>
                        </div>
                    </form>
                </Modal>
                )}

                {this.state.selectedEvent && (
                <Modal title= {this.state.selectedEvent.title}
                canCancel 
                canConfirm 
                onCancel={this.modelcancelHandler} 
                onConfirm={this.bookEventHandler}
                confirmWord = {this.context.token ? 'Book' : 'Ok'}
                >
                
                <h1>{this.state.selectedEvent.title}</h1>
                <h2>R{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                <p>
                    {this.state.selectedEvent.description}
                </p>
                </Modal>)}

               {this.context.token &&( <div className = "events-control">
                    <p>Share and create your own Events!</p>
                    <button className="btn" onClick={this.createEventHandler}>Create Event</button>
               </div>
               )}
               {this.state.isLoading ? <Spinner/>:   <EventList events={this.state.events} 
                authUserId = {this.context.userId}
                onViewDetail = {this.showDetailHandler}
               />}
             
            </React.Fragment>
        );
    }
}

export default EventPage;