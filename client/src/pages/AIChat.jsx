import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RiSendPlaneFill, RiRobot2Line, RiUser3Line } from "react-icons/ri";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "user", content: input },
      { type: "bot", content: "This is a placeholder response. The actual AI integration will be implemented later." },
    ]);
    setInput("");
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
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
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
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
