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

export const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.id });

    if (chat) {
      console.log("Chat found");
      return res.status(200).json(chat);
    } else {
      console.log("Chat not found");
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (err) {
    console.error("Error occurred at getSingleChat: ", err);
    return res.status(500).json({ message: "Error occurred at getSingleChat", error: err.message });
  }
};


export const getChats = async (req, res) => {
  try {
    // Find chats based on whether the user is a freelancer or buyer
    const chats = await Chat.find(
      req.isFreelancer ? { freelancerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    // Check if chats are found
    if (chats && chats.length > 0) {
      console.log("Chats found");
      res.status(200).send(chats);
    } else {
      console.log("No chats found");
      res.status(404).send("No chats found");
    }
  } catch (err) {
    console.error("Error occurred at get all chats: ", err);
    res.status(500).send("Error occurred at get all chats: " + err.message);
  }
}