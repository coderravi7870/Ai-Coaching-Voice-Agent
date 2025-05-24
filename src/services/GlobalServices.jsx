import axios from "axios";
import OpenAI from "openai";
import { ExpertList } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  return result.data;
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachingOption, msg) => {
  const option = ExpertList.find((item) => item.name === coachingOption);

  const PROMPT = option.prompt.replace("{user_topic}", topic);

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct",
    messages: [
      { role: "assistant", content: PROMPT },
      { role: "user", content: msg },
    ],
  });


  return completion.choices[0].message;
};


export const AIModelToGenerateFeedBackAndNotes = async (coachingOption, conversation) => {
  const option = ExpertList.find((item) => item.name === coachingOption);

  const PROMPT = option.summeryPrompt;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct",
    messages: [
      ...conversation,
      { role: "assistant", content: PROMPT },
    ],
  });


  return completion.choices[0].message;
};


export const ConvertTextToSpeech = async (text, expertName) => {
  const pollyClient = new PollyClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAcessKey: process.env.NEXT_PUBLIC_AWS_SECREAT_KEY,
    },
  });

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: expertName,
  });

  try {
    const { AudioStream } = await pollyClient.send(command);
    const audioArrayBuffer = await AudioStream.transformToByteArray();
    const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mp3" });

    const aduioUrl = URL.createObjectURL(audioBlob);
    return aduioUrl;
  } catch (error) {
    console.log(error);
  }
};

export const speakText = (text, setIsSpeacking, isSpeacking) => {
  if ("speechSynthesis" in window) {
    if (isSpeacking) {
      window.speechSynthesis.cancel();
      setIsSpeacking(false);
    } else {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN";
      speech.rate = 1;
      speech.pitch = 1;

      speech.onstart = () => setIsSpeacking(true);
      speech.onend = () => setIsSpeacking(false);

      window.speechSynthesis.speak(speech);
    }
  } else {
    alert("Sorry, your browser does not support text-to-speech.");
  }
};
