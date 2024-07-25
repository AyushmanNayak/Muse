import Messages from "../models/messages.model.js"
import Chat from "../models/chat.model.js";
export const createMessage = async(req, res) =>  {
    const newMessage = new Messages({
        chatId : req.params.id,
        userId  : req.userId,
        baat : req.body.baat,
    })
    try {
        const savedMessage = await newMessage.save();
        await Chat.findOneAndUpdate(
            {id : req.params.id},{
                $set : {
                    
                    lastMessage : req.body.baat
                } 
            },{
                new : true
            })
            res.status(200).send(savedMessage)  
    } catch (error) {
        
    }
}



export const getAllMessages = async(req, res) =>  {
    try {
        const messages =  await Messages.find({ chatId :req.params.id});
        res.status(200).send(messages);
    } catch (error) {
        res.send("erir while getting all messages");
    }
}