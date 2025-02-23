import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { RiSendPlaneFill, RiRobot2Line, RiUser3Line } from "react-icons/ri";

// Typing animation component
const TypingAnimation = () => (
  <div className="flex items-start space-x-3">
    <div className="p-2 rounded-full bg-gray-700">
      <RiRobot2Line className="w-5 h-5" />
    </div>
    <div className="p-3 rounded-lg bg-gray-800 flex items-center space-x-2">
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
  </div>
);

function AIChat() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Keep only the last 10 messages
  const updateMessages = (newMessage) => {
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      return updatedMessages.slice(-10); // Keep only the last 10 messages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message immediately
    updateMessages({ type: "user", content: userMessage });

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8000/api/ai/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          message: userMessage,
          context: messages.slice(-3).map(msg => ({ // Send last 3 messages for context
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.content
          }))
        }),
        credentials: 'include',
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      updateMessages({ type: "bot", content: data.response });
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.message === "No authentication token found") {
        navigate("/login");
      } else {
        updateMessages({
          type: "bot",
          content: "I apologize, but I'm having trouble processing your request. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">AI Financial Assistant</h1>
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/ai-chat"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
                >
                  AI Chat
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-xl h-[calc(100vh-12rem)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start space-x-3 ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.type === "user" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {message.type === "user" ? (
                    <RiUser3Line className="w-5 h-5" />
                  ) : (
                    <RiRobot2Line className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === "user"
                      ? "bg-blue-600"
                      : "bg-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && <TypingAnimation />}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center space-x-2 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={isLoading}
              >
                <span>{isLoading ? "Sending..." : "Send"}</span>
                <RiSendPlaneFill className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIChat;
