import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

const placeholderText = "Hi I'm Remo! Your Personal AI Assistant";

const Home: React.FC = () => {
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setInputText(""); // Clear after send
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSendMessage}
        className="w-full max-w-2xl flex flex-col items-center gap-4"
      >
        <div className="flex items-end rounded-3xl border border-gray-200 shadow-sm px-6 py-4 bg-white min-h-[100px] w-full">
          {/* Textarea */}
          <textarea
            className="flex-1 resize-none border-none outline-none bg-transparent text-lg p-0 min-h-[32px] max-h-40"
            placeholder={placeholderText}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
          />
          {/* Send Button at the end */}
          <button
            type="submit"
            className="ml-4 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition flex items-center justify-center"
          >
            <IoIosSend size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
