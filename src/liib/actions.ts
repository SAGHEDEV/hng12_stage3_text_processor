import { format, isToday, isYesterday } from "date-fns";

export const handleTranslateLanguage = async ({
  message,
  targetLanguage,
  sourceLanguage,
}: {
  message: string;
  targetLanguage: string;
  sourceLanguage: string;
}): Promise<{ success: boolean; message: string | null }> => {
  const ai = (self as { ai?: any }).ai;
  if (!ai) {
    console.error("AI API not available.");
    return {
      success: false,
      message: "This seems to be unaccessible on your device",
    };
  }

  if (!ai?.translator) {
    console.error("AI Translator API not available.");
    return { success: false, message: "Translation API is not available" };
  }

  const translatorCapabilities = await ai.translator.capabilities();
  const isAvailable = translatorCapabilities.languagePairAvailable(
    sourceLanguage,
    targetLanguage
  );

  console.log("Is Language Pair Available?:", isAvailable);

  let translator: any;

  if (isAvailable === "no") {
    console.error("Translation not available for this language pair.");
    return {
      success: false,
      message: "Translation not available for this language pair!",
    };
  } else if (isAvailable === "after-download") {
    translator = await ai.translator.create({
      sourceLanguage,
      targetLanguage,
      monitor: (m: EventTarget) => {
        m.addEventListener("downloadprogress", (e) => {
          const event = e as ProgressEvent<EventTarget>;
          console.log(`Downloading: ${event.loaded} of ${event.total} bytes.`);
        });
      },
    });
  } else {
    translator = await ai.translator.create({ sourceLanguage, targetLanguage });
  }

  const result: string = await translator.translate(message);
  console.log("Translation Result:", result || "null");

  return { success: true, message: result };
};

export const handlegetLanguageType = async ({
  message,
}: {
  message: string;
}): Promise<{ success: boolean; message: string | null }> => {
  const ai = (self as { ai?: any }).ai;
  if (!ai) {
    console.error("AI API not available.");
    return {
      success: false,
      message: "This seems to be unaccessible on your device",
    };
  }

  if (!ai?.languageDetector) {
    console.error("AI Translator API not available.");
    return { success: false, message: "Translation API is not available" };
  }

  const languageDetectorCapabilities = await ai.languageDetector.capabilities();
  const isAvailable = languageDetectorCapabilities.languageAvailable("en");

  let detector: any;

  if (isAvailable === "no") {
    console.error("Language detection not available.");
    return { success: false, message: "Language detection not available!" };
  }
  if (isAvailable === "readily") {
    detector = await ai.languageDetector.create();
  } else {
    detector = await ai.languageDetector.create({
      monitor(m: EventTarget) {
        m.addEventListener("downloadprogress", (e) => {
          const event = e as ProgressEvent<EventTarget>;
          console.log(`Downloading: ${event.loaded} of ${event.total} bytes.`);
        });
      },
    });
    await detector.ready;
  }
  const results: { detectedLanguage: string }[] = await detector.detect(
    message
  );
  return { success: true, message: results[0].detectedLanguage };
};

export const handleSummarizeText = async (
  message: string
): Promise<{ success: boolean; message: string }> => {
  const ai = (self as { ai?: any }).ai;
  if (!ai) {
    console.error("AI API not available.");
    return {
      success: false,
      message: "This seems to be unaccessible on your device",
    };
  }

  if (!ai?.summarizer) {
    console.error("AI Summarization API not available.");
    return { success: false, message: "AI Summarization API not available." };
  }
  const summaraizeCapability = await ai.summarizer.capabilities();
  const isAvailable = summaraizeCapability.available;
  console.log(isAvailable);
  const options = { type: "key-points", format: "markdown", length: "medium" };

  let summarizer: any;
  if (isAvailable === "no") {
    console.error("Summarization not available for this device.");
    return {
      success: false,
      message: "Summarization not available for this device.",
    };
  }
  if (isAvailable === "readily") {
    summarizer = await ai.summarizer.create(options);
  } else {
    console.log("downloading...");
    summarizer = await ai.summarizer.create({
      monitor: (m: EventTarget) => {
        m.addEventListener("downloadprogress", (e) => {
          const event = e as ProgressEvent<EventTarget>;
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
    summarizer = await ai.summarizer.create(options);
  }

  const result: string = await summarizer.summarize(message);
  console.log(result);
  return { success: true, message: result };
};

export const handleDetectFullLanguage = (code: string): string => {
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

export const handleCopy = async (text: string | undefined): Promise<void> => {
  await window.navigator.clipboard.writeText(text ?? "");
};

export const formatCustomDate = (date: Date): string => {
  const formattedTime = format(date, "hh:mm a");
  if (isToday(date)) {
    return `${formattedTime} Today`;
  } else if (isYesterday(date)) {
    return `${formattedTime} Yesterday`;
  } else {
    return `${formattedTime} ${format(date, "dd/MM/yyyy")}`;
  }
};
