import { format, isToday, isYesterday } from "date-fns";

export const handleTranslateLanguage = async ({
  message,
  targetLanguage,
  sourceLanguage,
}: {
  message: string;
  targetLanguage: string;
  sourceLanguage: string;
}) => {
  if (!("ai" in self) || !("translator" in self.ai)) {
    console.error("AI Translator API not available.");
    return null;
  }

  const translatorCapabilities = await self.ai.translator.capabilities();
  const isAvailable = translatorCapabilities.languagePairAvailable(
    sourceLanguage,
    targetLanguage
  );

  console.log("Is Language Pair Available?:", isAvailable);

  let translator;

  if (isAvailable === "no") {
    console.error("Translation not available for this language pair.");
    return {
      success: false,
      message: "Translation not available for this language pair!",
    };
  } else if (isAvailable === "after-download") {
    translator = await self.ai.translator.create({
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      monitor: (m: EventTarget) => {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloading model: ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
  } else {
    translator = await self.ai.translator.create({
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
    });
  }

  const result = await translator.translate(message);
  console.log("Translation Result:", result || "null");

  return { success: true, message: result };
};

export const handlegetLanguageType = async ({
  message,
}: {
  message: string;
}) => {
  if (!("ai" in self) || !("languageDetector" in self.ai)) {
    console.error("AI Translator API not available.");
    return null;
  }

  const languageDetectorCapabilities =
    await self.ai.languageDetector.capabilities();
  const isAvailable = languageDetectorCapabilities.languageAvailable("en");

  let detector;

  if (isAvailable === "no") {
    console.error("Translation not available for this language pair.");
    return {
      success: false,
      message: "Translation not available for this language pair!",
    };
  }
  if (isAvailable === "readily") {
    detector = await self.ai.languageDetector.create();
  } else {
    detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
    await detector.ready;
  }
  const results = await detector.detect(message);
  return {
    success: true,
    message: results[0].detectedLanguage,
  };
};

export const handleSummarizeText = async (message: string) => {
  if (!("ai" in self) && !("summarizer" in self.ai)) {
    console.error("AI Summarization API not available.");
    return {
      success: false,
      message: "AI Summarization API not available.",
    };
  }
  const summaraizeCapability = await self.ai.summarizer.capabilities();
  const isAvailable = summaraizeCapability.available;
  console.log(isAvailable);
  const options = {
    type: "key-points",
    format: "markdown",
    length: "medium",
  };

  let summarizer;
  if (isAvailable === "no") {
    console.error("Summarization not available for this device.");
    return {
      success: false,
      message: "Summarization not available for this device.",
    };
  }
  if (isAvailable === "readily") {
    summarizer = await self.ai.summarizer.create(options);
  } else {
    console.log("downloading...");
    summarizer = await self.ai.summarizer.create({
      monitor: (monitor: any) => {
        monitor.addEventListener("downloadprogress", (event: any) => {
          console.log(
            `Downloading: ${event.loaded} of ${event.total} bytes (${(
              (event.loaded / event.total) *
              100
            ).toFixed(2)}%)`
          );
        });
      },
    });
    await summarizer.ready;
    summarizer = await self.ai.summarizer.create(options);
  }

  const result = await summarizer.summarize(message);
  console.log(result);
};

export const handleDetectFullLanguage = (code: string) => {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese (Mandarin)",
    ja: "Japanese",
    ko: "Korean",
    hi: "Hindi",
    ar: "Arabic",
    bn: "Bengali",
    ur: "Urdu",
    tr: "Turkish",
    nl: "Dutch",
    sv: "Swedish",
    pl: "Polish",
    fi: "Finnish",
    no: "Norwegian",
    da: "Danish",
    el: "Greek",
    he: "Hebrew",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
    ms: "Malay",
    ta: "Tamil",
    te: "Telugu",
    fa: "Persian (Farsi)",
    uk: "Ukrainian",
    hu: "Hungarian",
    cs: "Czech",
    ro: "Romanian",
    sr: "Serbian",
    bg: "Bulgarian",
    hr: "Croatian",
    sk: "Slovak",
  };

  return languages[code] || "Unknown Language";
};

export const handleCopy = async (text: string | undefined) => {
  await window.navigator.clipboard.writeText(text as string);
};

export const formatCustomDate = (date: Date): string => {
  const formattedTime = format(date, "hh:mm a"); // 09:02 PM format

  if (isToday(date)) {
    return `${formattedTime} Today`;
  } else if (isYesterday(date)) {
    return `${formattedTime} Yesterday`;
  } else {
    return `${formattedTime} ${format(date, "dd/MM/yyyy")}`; // 09:02 PM 12/02/2025
  }
};
