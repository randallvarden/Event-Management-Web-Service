const Booking = require('../../models/booking');
const {bookingTransformer, eventTransformer} = require('./merge');
const Event  = require('../../models/event');

module.exports = {
    bookings: async (args, req) =>{
        if(!req.isUser){
            throw new Error('Not authenticated!');
        }
        try{
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking =>{
                return bookingTransformer(booking);
            });
        } catch(err){
            throw err;
        }
    },
    bookEvent: async (args,req) => {
        if(!req.isUser){
            throw new Error('Not authenticated!');
        }
        const fetchEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchEvent
        });
        const result = await booking.save();
        return bookingTransformer(result);
    },
    cancelBooking: async (args,req) => {
        if(!req.isUser){
            throw new Error('Not authenticated!');
        }
        try {
          const booking = await Booking.findById(args.bookingId).populate('event');
          const event = eventTransformer(booking.event);
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      }
};