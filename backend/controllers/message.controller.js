import Conversation from "../models/conversation.model.js";
import Message from "../models/Message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendmessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      //io.to(<socket_id>).emit() used to send events to spesific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("message");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.message;

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
