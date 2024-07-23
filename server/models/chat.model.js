import mongoose from 'mongoose';
const { Schema } = mongoose;

const chatSchema = new Schema({
    chatId: {
        type: String,
        required: true,
        unique: true,
    },
    // readByFreelancer: {
    //     type: Boolean,
    //     default : false,
    //     required: true,
    //   },
    //   readByBuyer: {
    //     type: Boolean,
    //     default : false,
    //     required: true,
    //   },

    freelancerId: {
        type: String,
        required: true
    },

    buyerId: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

export default mongoose.model('Chat', chatSchema);
