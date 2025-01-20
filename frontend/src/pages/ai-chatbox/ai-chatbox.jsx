import { useState } from "react";
import axios from "axios";

const AIChatbox = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (userMessage.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, isUser: true }]);
      setUserMessage("");

      try {
        const response = await axios.post("/api/get-ai-response", { userMessage });
        const aiResponse = response.data.aiResponse;
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiResponse, isUser: false },
        ]);
      } catch (error) {
        console.error("Error communicating with server:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-white">
      <div className="flex-1 overflow-auto mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${message.isUser ? "bg-blue-500" : "bg-gray-700"}`}
            >
              <span>{message.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="w-full p-2 bg-gray-800 rounded-lg text-white"
          placeholder="Ask something..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbox;

