import InputForm from "../components/InputForm";
import { useMessagesStore } from "../zustand";
import MessageBox from "../components/MessageBox";
import { useEffect, useRef } from "react";

const TextProcessor = () => {
  const messages = useMessagesStore((store) => store.messages);
  const loadMessage = useMessagesStore((store) => store.loadMessages);
  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    loadMessage?.();
  }, [loadMessage]);

  return (
    <main className="w-full h-screen min-w-screen relative flex flex-col justify-between items-center gap-4 text-[#C9D1D9] bg-[#0D1117]">
      <div className="w-[95%] m-auto flex justify-between items-center !py-6">
        <h1 className="text-2xl font-bold text-left text-[#FF9D00] flex gap-2.5 items-center">
          <img src="/assets/book-logo.svg" alt="" className="w-8 h-8" />
          <span className="text-white">TextEase</span>
        </h1>
        <button className="hidden md:block px-5 py-3 rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-sm text-white font-semibold cursor-pointer">
          Contact Developer
        </button>
      </div>

      <div
        ref={contentRef}
        className="w-[95%] h-full flex-1 overflow-auto px-5 py-7 border border-[#58A6FF]/40 backdrop-blur-2xl rounded-2xl shadow-lg bg-[#161B22] scroll-bar"
      >
        <div className="w-full flex flex-col gap-6">
          {messages.map((message, index) => (
            <MessageBox
              chat={message}
              index={index}
              key={message.date + "key"}
            />
          ))}
        </div>
      </div>

      <InputForm />
    </main>
  );
};

export default TextProcessor;
