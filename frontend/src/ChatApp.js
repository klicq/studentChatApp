import React, { useState, useEffect, useRef } from "react";

// AI Avatar Component
const AIAvatar = ({ className = "" }) => (
  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg ${className}`}>
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className="text-white"
    >
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
    </svg>
  </div>
);

// User Avatar Component
const UserAvatar = ({ className = "" }) => (
  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-charcoal-600 to-charcoal-700 shadow-lg ${className}`}>
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className="text-white"
    >
      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
    </svg>
  </div>
);

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Welcome to Student Helper! How can I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick access sidebar options
  const sidebarOptions = [
    {
      id: "medical",
      emoji: "🚑",
      title: "Medical Help",
      query: "medical center campus clinic health emergency doctor nurse"
    },
    {
      id: "security",
      emoji: "🔒",
      title: "Campus Security",
      query: "campus security safety emergency contact security office"
    },
    {
      id: "it-support",
      emoji: "💻",
      title: "IT Support",
      query: "IT support technical help computer Wi-Fi internet login password"
    },
    {
      id: "library",
      emoji: "📚",
      title: "Library Info",
      query: "library hours location books resources study spaces"
    },
    {
      id: "mental-health",
      emoji: "🧠",
      title: "Mental Health",
      query: "counseling mental health support wellness counseling service"
    },
    {
      id: "clubs-events",
      emoji: "🎉",
      title: "Clubs & Events",
      query: "student activities clubs events festivals competitions"
    },
    {
      id: "faqs",
      emoji: "❓",
      title: "FAQs",
      query: "frequently asked questions common queries help"
    },
    {
      id: "feedback",
      emoji: "✉️",
      title: "Feedback",
      query: "feedback suggestions complaints improvement"
    },
    {
      id: "campus-map",
      emoji: "🗺️",
      title: "Campus Map",
      query: "campus map location directions building locations"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return; // Prevent sending while loading

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      const botMessage = { id: Date.now() + 1, sender: "bot", text: data.answer };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + 1, sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle quick access sidebar clicks
  const handleQuickAccess = async (option) => {
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
    
    // Add user message showing what they clicked
    const userMessage = { 
      id: Date.now(), 
      sender: "user", 
      text: `${option.emoji} ${option.title}` 
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: option.query }),
      });
      const data = await response.json();
      const botMessage = { 
        id: Date.now() + 1, 
        sender: "bot", 
        text: data.answer 
      };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: "Sorry, something went wrong while fetching information." 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-pale_purple-800">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-french_gray-500 border-r border-charcoal-700 p-4 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 z-40 overflow-y-auto`}>
        {/* Close button - visible only on small screens */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="mb-4 text-charcoal-700 md:hidden text-2xl font-bold focus:outline-none"
          aria-label="Close sidebar"
        >
          ×
        </button>
        
        {/* Sidebar Header */}
        <div className="mb-6">
          <h2 className="text-charcoal-700 font-bold mb-2 text-xl select-none">Quick Access</h2>
          <p className="text-charcoal-600 text-sm">Click any option below for instant help!</p>
        </div>

        {/* Quick Access Options */}
        <div className="space-y-2">
          {sidebarOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleQuickAccess(option)}
              className="w-full text-left p-3 rounded-lg bg-white hover:bg-pale_purple-100 border border-charcoal-200 hover:border-charcoal-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-charcoal-400 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-charcoal-700 font-medium group-hover:text-charcoal-900">
                  {option.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-3 bg-pale_purple-100 rounded-lg">
          <p className="text-charcoal-600 text-xs">
            💡 <strong>Tip:</strong> You can also type your questions directly in the chat!
          </p>
        </div>
      </aside>

      {/* Main chat content */}
      <div className="flex flex-col flex-1">

        {/* Mobile Header */}
        <header className="flex items-center justify-between bg-charcoal-500 text-white p-4 shadow-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 rounded-md hover:bg-charcoal-400 focus:outline-none focus:ring-2 focus:ring-charcoal-300"
            aria-label="Open sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">🎓 Student Helper</h1>
          <div /> {/* Placeholder for future header content */}
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between bg-charcoal-500 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold">🎓 Student Helper</h1>
          <p className="text-charcoal-200">Your AI-powered university assistant</p>
        </header>

        {/* Chat messages */}
        <main className={`flex-grow p-6 overflow-y-auto bg-lavender_web-100 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
          <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                {msg.sender === "user" ? <UserAvatar /> : <AIAvatar />}
                
                {/* Message content */}
                <div className="flex flex-col">
                  {/* Name label for AI */}
                  {msg.sender === "bot" && (
                    <div className="text-xs text-charcoal-600 mb-1 font-medium">
                      Student Helper AI
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl border shadow break-words select-text
                      ${msg.sender === "user"
                        ? "bg-charcoal-600 text-pale_purple-900 border-charcoal-700"
                        : "bg-pale_purple-200 text-charcoal-900 border-pale_purple-300"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start space-x-3">
                {/* AI Avatar */}
                <AIAvatar />
                
                {/* Loading content */}
                <div className="flex flex-col">
                  {/* Name label for AI */}
                  <div className="text-xs text-charcoal-600 mb-1 font-medium">
                    Student Helper AI
                  </div>
                  
                  {/* Loading message */}
                  <div className="w-fit max-w-[200px] px-4 py-2 rounded-2xl border shadow bg-charcoal-400 text-pale_purple-900 border-charcoal-500 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-pale_purple-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-pale_purple-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-pale_purple-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs whitespace-nowrap">Searching...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="p-4 border-t border-charcoal-400 bg-pale_purple-100">
          <form onSubmit={(e) => e.preventDefault()} className="max-w-3xl mx-auto flex space-x-4">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow rounded-full border border-charcoal-400 px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-charcoal-600"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className={`rounded-full px-6 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal-700 ${
                loading
                  ? "bg-charcoal-300 text-pale_purple-500 cursor-not-allowed"
                  : "bg-charcoal-600 text-pale_purple-900 hover:bg-charcoal-500"
              }`}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
