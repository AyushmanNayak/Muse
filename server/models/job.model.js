import mongoose from 'mongoose';
const { Schema } = mongoose;
const jobSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true 
    },
    cover: {
        type: String,
        required: true
    },
    short_title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    long_description: {
        type: String,
    }
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);
