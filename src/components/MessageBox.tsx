import { useState } from "react";
import {
  formatCustomDate,
  handleCopy,
  handleDetectFullLanguage,
  handleSummarizeText,
  handleTranslateLanguage,
} from "../liib/actions";
import { messageStore, useMessagesStore } from "../zustand";
import { IoIosCopy } from "react-icons/io";
import { GiSpeaker } from "react-icons/gi";
import { FaRegCircleStop } from "react-icons/fa6";
import { useSpeech } from "react-text-to-speech";

const languages = [
  { code: "en", name: "English" },
  { code: "pt", name: "Portuguese" },
  { code: "es", name: "Spanish" },
  { code: "ru", name: "Russian" },
  { code: "tr", name: "Turkish" },
  { code: "fr", name: "French" },
];

const MessageBox = ({ chat, index }: { chat: messageStore; index: number }) => {
  const updateMessage = useMessagesStore((state) => state.updateMessage);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [translateError, setTranslateError] = useState("");
  const [summarizerError, setSummarizerError] = useState("");
  const [translateLoading, setTranslateLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleTranslateMessage = async () => {
    try {
      setTranslateError("");
      setTranslateLoading(true);

      if (selectedLanguage === chat.lang) {
        throw new Error("Cannot translate the same language pair!");
      }

      const result = await handleTranslateLanguage({
        message: chat.message,
        sourceLanguage: chat.lang,
        targetLanguage: selectedLanguage,
      });

      if (result?.success) {
        updateMessage(index, {
          translate: { result: result.message, lang: selectedLanguage },
        });
      } else {
        throw new Error(
          result?.message || "Translation failed. Kindly try again."
        );
      }
    } catch (error: any) {
      setTranslateError(error.message || "An unexpected error occurred.");
    } finally {
      setTranslateLoading(false);
    }
  };

  const handleSummarizeMessage = async () => {
    setSummaryLoading(true);
    try {
      const result = await handleSummarizeText(chat.message);
      if (result?.success) {
        updateMessage(index, {
          summary: result.message,
        });
      } else {
        throw new Error(
          result?.message || "Summarization failed. Kindly try again."
        );
      }
    } catch (error: any) {
      console.log(error);
      setSummarizerError(
        error.message || "Summarization failed! Kindly try again"
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const { speechStatus, start, stop } = useSpeech({
    text: chat.message,
    voiceURI: "Microsoft Mark",
  });

  return (
    <div className="w-full !p-3 bg-white/5 rounded-xl flex flex-col gap-3 border-b-2 border-r-2 border-gray-100/50">
      <time className="text-[10px]">{formatCustomDate(chat.date)}</time>
      <div className="!p-2 bg-white/10 rounded-lg">
        <div className="mb-2 flex items-center gap-3 !py-2">
          <p className="font-medium">Your message: </p>
          <span
            aria-label="Listen to my message"
            className="inline-block !p-1 rounded-full bg-white/20 text-[#FF9D00]/70 hover:text-[#FF9D00] cursor-pointer"
            onClick={speechStatus !== "started" ? start : stop}
          >
            {speechStatus === "started" ? <FaRegCircleStop /> : <GiSpeaker />}
          </span>
        </div>
        <p className="font-medium text-base !p-2 bg-white/10 rounded-lg">
          {chat.message}
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row justify-between items-start md:items-center">
        <p className="text-xs">
          Detected Language:{" "}
          <span className="text-sm font-medium">
            {handleDetectFullLanguage(chat.lang)}
          </span>
        </p>
        <div className="flex flex-col md:flex-row justify-start md:justify-end items-start md:items-center gap-3">
          {chat.lang === "en" && chat.message.trim().length > 150 && (
            <button
              onClick={handleSummarizeMessage}
              className="px-5 py-3 rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-white font-semibold cursor-pointer"
            >
              Summarize
            </button>
          )}
          <div className="flex gap-3 items-center">
            <div className="relative flex items-center gap-1 w-fit mx-auto">
              <label htmlFor="language" className="text-sm font-semibol">
                Transalte to:
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#161B22] text-white text-sm border border-[#58A6FF]/40 focus:ring-2 focus:ring-[#58A6FF] outline-none shadow-lg transition-all"
                  aria-label="Select a language"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="text-white"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleTranslateMessage}
              className="px-5 py-3 h-fit rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-white font-semibold cursor-pointer"
            >
              Translate
            </button>
          </div>
        </div>
      </div>
      {chat.summarry && (
        <div className="relative !p-2 bg-white/10 rounded-lg">
          <span
            aria-label="Copy summary"
            className="!p-1 rounded-full bg-white/20 text-[#FF9D00]/70 hover:text-[#FF9D00] cursor-pointer absolute top-2 right-2"
            onClick={async () => await handleCopy(chat.summarry)}
          >
            <IoIosCopy />
          </span>
          <p className="font-medium">Summary:</p>
          <p className="text-sm font-light text-gray-400">{chat.summarry}</p>
        </div>
      )}
      {chat.translate && (
        <div className="relative !p-2 bg-white/10 rounded-lg">
          <span
            aria-label="Copy Translation"
            onClick={async () => await handleCopy(chat.translate?.result)}
            className="!p-1 rounded-full bg-white/20 text-[#FF9D00]/70 hover:text-[#FF9D00] cursor-pointer absolute top-2 right-2"
          >
            <IoIosCopy />
          </span>
          <p className="font-medium mb-2">
            Translation:{" "}
            <span className="italic font-light text-xs">
              (Language: {handleDetectFullLanguage(chat.translate.lang)})
            </span>
          </p>
          <p className="text-sm font-bold text-gray-400">
            {chat.translate.result}
          </p>
        </div>
      )}
      {(translateLoading || summaryLoading) && (
        <p className="animate-pulse">
          {translateLoading ? "Translation" : "Summarization"} Loading....
        </p>
      )}
      {summarizerError && (
        <p className="text-sm font-medium text-red-600">
          Summarizer says: {summarizerError}
        </p>
      )}
      {translateError && (
        <p className="text-sm font-medium text-red-600">
          Transalator says: {translateError}
        </p>
      )}
    </div>
  );
};

export default MessageBox;
