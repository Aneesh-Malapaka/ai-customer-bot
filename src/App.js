import React, { useState, useEffect } from "react";
// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // call Gemini Api to get a response
      const response = await fetch("https://ai-customer-bot-server.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      const responseText = await response.json();
      console.log(responseText);
      // add Gemeni's response to the chat history
      let parsedMessage = responseText, finalResponse="";
    
      if(parsedMessage.orders||parsedMessage.order){
        if(parsedMessage.orders){
          parsedMessage.orders.forEach(
            (message)=>{
              console.log(message)
              finalResponse +=message.response+" "
            }
          )
        }
        else{
          finalResponse = parsedMessage.order.response
        }
      }
      else{
        finalResponse = parsedMessage.message
      }
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: finalResponse },
      ]);
    } catch(e) {
      console.error("Error sending message", e);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Cloud Restaurant Customer Service</h1>

      <div className="chat-container rounded-lg shadow-md p-4 flex flex-col gap-5 max-w-screen-lg max-h-96 overflow-y-scroll my-10 mx-auto">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default App;
