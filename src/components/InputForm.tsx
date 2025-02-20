import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { handlegetLanguageType } from "../liib/actions";
import { useMessagesStore } from "../zustand";

const InputForm = () => {
  const [message, setMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const addMessage = useMessagesStore((state) => state.addMessage);
  const handleSubmitText = async () => {
    setInputError("");
    if (message === "") {
      setInputError("Input can't be empty!");
      return;
    }
    const response = await handlegetLanguageType({ message });
    if (response?.success) {
      const messageObject = {
        message: message,
        lang: response.message as string,
        date: new Date(),
      };
      addMessage(messageObject);
    }
    setMessage("");
  };
  return (
    <div className="w-[95%] m-auto !py-4 bottom-0">
      {inputError && <p className="!py-2 text-red-600">{inputError}</p>}
      <div className="w-full flex justify-between items-center gap-4">
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ resize: "none" }}
          cols={1}
          placeholder="What are you processing.."
          className="w-full h-14 bg-[#161B22] rounded-xl focus:outline-none focus:bg-[#58A6FF]/10 !p-3 text-[#C9D1D9] placeholder-gray-500 border border-[#58A6FF]/40 font-medium"
        ></textarea>
        <button
          type="submit"
          onClick={handleSubmitText}
          className="w-full max-w-14 !h-14 rounded-xl flex justify-center items-center bg-[#FF9D00] text-white cursor-pointer hover:bg-[#e68a00] active:scale-95 transition-transform duration-200"
        >
          <IoIosSend size={26} />
        </button>
      </div>
    </div>
  );
};

export default InputForm;
