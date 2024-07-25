import Chat from "../models/chat.model.js";

export const createChat = async (req, res) => {
  console.log('Incoming request:', req.body, req.userId, req.isFreelancer);

  if (!req.userId || typeof req.isFreelancer === 'undefined') {
    return res.status(400).send('Invalid user data');
  }

  const newChat = new Chat({
    chatId: req.isFreelancer ? req.userId + req.body.to : req.body.to + req.userId,
    freelancerId: req.isFreelancer ? req.userId : req.body.to,
    buyerId: req.isFreelancer ? req.body.to : req.userId,
  });

  try {
    const savedChat = await newChat.save();
    res.status(201).send(savedChat);
  } catch (err) {
    res.status(500).send("Error occurred at createChat: " + err);
  }
};


export const updateChat = async (req, res, next) => {
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          readByFreelancer: true,
          readByBuyer: true,
          ...(req.isFreelancer ? { readByFreelancer: true } : { readByBuyer: true }),
        },
      },
      { new: true } //to see the new chat
    );

    res.status(200).send(updatedChat);
  } catch (err) {
    res.send("error occured at update Chat"  + err);
  }
};

export const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.id });
    if (chat) {
      console.log("happy happy");
      return res.status(200).send(chat);
    } else {
      console.log("bvbv");
      return res.status(404).send("Chat not found");
    }
  } catch (err) {
    return res.status(500).send("Error occurred at getSingleChat: " + err);
  }
};


export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find(
      req.isFreelancer ? { freelancerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });
    if(chats) console.log("ok ok")
    res.status(200).send(chats);
  } catch (err) {
    res.send("error occured at get all chats " + err);
  }
};