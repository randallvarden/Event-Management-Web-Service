const Event  = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helper/date');
const DataLoader = require('dataloader');


const eventDataLoader = new DataLoader((eventIds) =>{
    return events(eventIds);
});

const userDataLoader = new DataLoader(userIds =>{
    return User.find({
        _id: {$in:userIds}
    });
});

const events = async eventIds => {
    try{
    const events = await Event.find({
        _id: {$in:eventIds}
    })
    return events.map(event =>{
            return eventTransformer(event);
        });
    } catch(err){
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
      const event = await eventDataLoader.load(eventId.toString());
      return event;
    } catch (err) {
      throw err;
    }
  };

const user = async userId => {
    try{
    const user = await userDataLoader.load(userId.toString());
        return {...user._doc, _id:user.id, 
            createdEvents:() => eventDataLoader.loadMany(user._doc.createdEvents)
        };
    } catch(err){
        throw err;
    }
};

const eventTransformer = event => {
    return {...event._doc,
        _id: event.id,
        date:dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
       };
};

const bookingTransformer = booking =>{
    return {...booking._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

exports.eventTransformer = eventTransformer;
exports.bookingTransformer = bookingTransformer;
exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;