import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type : String,
        required : true 
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dp: {
        type: String
    },
    profession : {
        type  : String
    },
    isFreelancer: {
        type: Boolean,
        default: false, // Use lowercase 'false' for default value
        required: false
    }
}, { timestamps: true }); // Set timestamps as an object

export default mongoose.model("User", userSchema);
