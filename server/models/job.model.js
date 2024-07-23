import mongoose from 'mongoose';
const { Schema } = mongoose;
const jobSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    total_rating: {
        type: Number,
        default: 0
    },
    star_number: {
        type: Number,
        default: 0
    },
    category: {
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
    images: {
        type: [String],
        required: false
    },
    short_title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);
