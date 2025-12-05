import React, { useState } from "react";
import { useParams } from "react-router";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([{ text: "Hello world" }]);

  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          return (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Kartik Shingde
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input className="flex-1 border border-gray-400 text-white p-2 rounded-xl"></input>
        <button className="btn btn-secondary">Send</button>
      </div>
    </div>
  );
};

export default Chat;
