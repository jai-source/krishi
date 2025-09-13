import axios from "axios";

const GOOGLE_TRANSLATE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text) return "";
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLang,
        format: "text"
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
