import React, { useEffect, useState, useRef } from "react";
import { Await, useParams } from "react-router";
import { Socket } from "socket.io-client";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null); // Store target user info

  const user = useSelector((store) => store.user);
  // console.log("currentUser: ", user);
  const userId = user?._id;
  const profileUrl = user?.profileUrl;

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "12:45";

    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const fetchChatMessages = async () => {
    if (!userId) {
      console.log("User ID not available yet, skipping fetch");
      return; // Don't fetch if userId is not ready
    }

    const chat = await axiosInstance.get(BASE_URL + "/chat/" + targetUserId);

    

    const target = chat.data.participants?.find(
      (participant) => participant._id.toString() !== userId.toString()
    );

    console.log("Target user found:", target);

    setTargetUser(target);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;

      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text: msg.text,
        createdAt: createdAt,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    if (userId) {
      // Only fetch when userId is available
      fetchChatMessages();
    }
  }, [userId]); // Add userId as dependency

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      // console.log(firstName + ": " + text);
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, createdAt: new Date() },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100dvh-5rem)] md:h-[75vh] flex flex-col bg-base-200 md:rounded-2xl md:shadow-2xl overflow-hidden md:my-6 md:border md:border-base-300">
      {/* Header - Modern Gradient Design - Sticky within chat container */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-primary via-secondary to-accent border-b border-base-300/50 shadow-lg sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="avatar online placeholder">
            <div className="w-11 sm:w-12 rounded-full bg-base-100 ring ring-primary ring-offset-2 ring-offset-base-200">
              <img src={targetUser?.profileUrl} alt="Target user avatar" className="rounded-full"></img>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-primary-content">
              {targetUser
                ? `${targetUser.firstName} ${targetUser.lastName}`
                : "Chat"}
            </h1>
            <p className="text-xs sm:text-sm text-primary-content/80 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Active now...feature coming soon
            </p>
          </div>
          <button className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-base-100/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area - Enhanced Scrolling with proper height */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-base-100"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-200 flex items-center justify-center mb-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-base sm:text-lg font-semibold mb-1">
              No messages yet
            </p>
            <p className="text-xs sm:text-sm text-center px-4">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMe = user.firstName === msg.firstName;
              return (
                <div
                  key={index}
                  className={"chat " + (isMe ? "chat-end" : "chat-start")}
                >
                  <div className="chat-image avatar">
                    <div className="w-9 sm:w-10 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                      <img
                        alt="User avatar"
                        src={isMe ? profileUrl : targetUser?.profileUrl}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="chat-header text-sm sm:text-base font-semibold mb-1">
                    <span className={isMe ? "text-primary" : "text-secondary"}>
                      {`${msg.firstName} ${msg.lastName}`}
                    </span>
                    <time className="text-xs opacity-60 ml-2">
                      {formatTime(msg.createdAt)}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble text-sm sm:text-base shadow-lg max-w-[85%] sm:max-w-xs md:max-w-md break-words whitespace-pre-wrap ${
                      isMe ? "chat-bubble-primary" : "chat-bubble-secondary"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {/* Invisible element at the end for auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed position with proper mobile handling */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-base-200 border-t border-base-300 shadow-lg shrink-0">
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Emoji Button (Hidden on small screens) */}
          <button className="hidden sm:flex btn btn-circle btn-ghost btn-sm hover:btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Input Field */}
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 input input-bordered bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base shadow-inner"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className={`btn btn-primary btn-circle shadow-lg transition-transform hover:scale-110 ${
              !newMessage.trim() ? "btn-disabled opacity-50" : ""
            }`}
            disabled={!newMessage.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: hsl(var(--bc) / 0.2);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--bc) / 0.3);
        }
      `}</style>
    </div>
  );
};

export default Chat;
