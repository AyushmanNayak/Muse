import mongoose from 'mongoose';
const { Schema } = mongoose;
//buyer iD and freelancer iD is necessary for communicatiion
const orderSchema = new Schema({
    jobId: {
        type: String,
        required: true
    },
    short_title : {
        type : String,
        required : true
    },
    img : {
        type : String
    },
    price : {
        type : Number,
        required : true
    },
    isCompleted : {
        type : Boolean,
         default : false
    },
    paid : {
        type : Boolean,
        default   : false
    },
    buyerId : {
             type: String,
            required: true
    },
    freelancerId: {
        type: String,
        required: true
    },
    payment_intent : {
        type : String 
    }
}
, {
    timestamps: true // This is the correct placement for the timestamps option
});

export default mongoose.model('Orders', orderSchema);
