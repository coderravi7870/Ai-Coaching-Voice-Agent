"use client";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { CoachingEXpert } from "@/services/Options";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";

// import RecordRTC from "recordrtc";
// import { RealtimeTranscriber } from "assemblyai";
import {
  AIModel,
  AIModelToGenerateFeedBackAndNotes,
  ConvertTextToSpeech,
  getToken,
} from "@/services/GlobalServices";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { toast } from "sonner";
import FeedBack from "./_components/FeedBack";
import { UserContext } from "@/app/_context/UserContext";
import Webcam from "react-webcam";

const DiscussionRoom = () => {
  const { roomid } = useParams();
  const { userData, setUserData } = useContext(UserContext);
  const [expert, setExpert] = useState();
  // const [transcribe,setTranscribe] = useState();
  // const [enableMic, setEnableMic] = useState(false);
  // const [auddioUrl, setAudioUrl] = useState();
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);

  // let texts = {};
  // let silenceTimeout;
  // const recorder = useRef(null);
  // const realtimeTranscriber = useRef(null);

  const inputRef = useRef();

  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  // console.log("expert", expert);
  const updateUserToken = useMutation(api.users.UpdateUserToken);

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingEXpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const handleSendBtn = async () => {
    const transcribe = inputRef.current.value;
    if (transcribe.length == 0) {
      alert("First Etner Your Doubt");
    }
    setLoading(true);

    // await updateUserTokenMathod(transcribe); // update users generated token

    // calling AI text Model to Get Response
    const aiResp = await AIModel(
      DiscussionRoomData.topic,
      DiscussionRoomData.coachingOption,
      transcribe
    );

    setConversation((prev) => [
      ...prev,
      { role: "user", content: transcribe },
      aiResp,
    ]);

    // const url = await ConvertTextToSpeech(
    //   aiResp.content,
    //   DiscussionRoomData.expertName
    // );

    // console.log(url);
    // setAudioUrl(url);

    setLoading(false);
    inputRef.current.value = "";

    await updateUserTokenMathod(aiResp.content); // update Ai generated Token
  };

  //

  useEffect(() => {
    const updateConversation = async () => {
      console.log("Conversation", conversation);
      if (conversation.length > 0) {
        await UpdateConversation({
          id: DiscussionRoomData?._id,
          conversation: conversation,
        });
      }
    };

    updateConversation();
  }, [conversation]);

  // const connectToServer = async () => {
  //   setEnableMic(true);
  //   setLoading(true);

  //   // Init Assembly AI

  //   realtimeTranscriber.current = new RealtimeTranscriber({
  //     token: await getToken(),
  //     sample_rate: 16_000,
  //   });

  //   realtimeTranscriber.current.on("transcript", async (transcript) => {
  //     console.log(transcript);
  //     let msg = "";

  //     if (transcript.message_type == "FinalTranscript") {
  //       setConversation((prev) => [
  //         ...prev,
  //         {
  //           role: "user",
  //           content: transcript.text,
  //         },
  //       ]);

  //       // calling AI text Model to Get Response
  //       const aiResp = await AIModel(
  //         DiscussionRoomData.topic,
  //         DiscussionRoomData.coachingOption,
  //         transcript.text
  //       );
  //       setConversation(prev=>[...prev,aiResp]);
  //       console.log(aiResp);
  //     }
  //     texts[transcript.audio_start] = transcript?.text;
  //     const keys = Object.keys(texts);
  //     keys.sort((a, b) => a - b);

  //     for (const key of keys) {
  //       if (texts[key]) {
  //         msg += `${texts[key]}`;
  //       }
  //     }
  //     setTranscribe(msg);
  //   });

  //   await realtimeTranscriber.current.connect();
  //   setLoading(false);

  //   if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then((stream) => {
  //         recorder.current = new RecordRTC(stream, {
  //           type: "audio",
  //           mimeType: "audio/webm;codecs=pcm",
  //           recorderType: RecordRTC.StereoAudioRecorder,
  //           timeSlice: 250,
  //           desiredSampRate: 16000,
  //           numberOfAudioChannels: 1,
  //           bufferSize: 4096,
  //           audioBitsPerSecond: 128000,
  //           ondataavailable: async (blob) => {
  //             // if (!realtimeTranscriber.current) return;
  //             // Reset the silence detection timer on audio input
  //             clearTimeout(silenceTimeout);

  //             const buffer = await blob.arrayBuffer();

  //             console.log(buffer);
  //             // realtimeTranscriber.current.sendAudio(buffer);

  //             // Restart the silence detection timer
  //             silenceTimeout = setTimeout(() => {
  //               console.log("User stopped talking");
  //               // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
  //             }, 2000);
  //           },
  //         });
  //         recorder.current.startRecording();
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     if (conversation[conversation.length - 1].role == "user") {
  //       // calling AI text Model to Get Response

  //       const lastTwoMsg = conversation.slice(-2);
  //       const aiResp = await AIModel(
  //         DiscussionRoomData.topic,
  //         DiscussionRoomData.coachingOption,
  //         lastTwoMsg
  //       );

  //       const url = await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName);

  //       console.log(url);
  // setAudioUrl(url);

  //       setConversation((prev) => [...prev, aiResp]);
  //     }
  //   }
  //   fetchData();
  // },[conversation]);

  // const disconnect = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   await realtimeTranscriber.current.disconnect();
  //   recorder.current.pauseRecording();
  //   recorder.current = null;
  //   setEnableMic(false);
  // await UpdateConversation({
  //   id: DiscussionRoomData._id,
  //   conversation: conversation
  // })
  //   setLoading(false);
  // setEnableFeedbackNotes(true);
  // };

  const updateUserTokenMathod = async (text) => {
    // console.log("text",text);
    
    const tokenCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    // console.log("tokenCount",tokenCount);

    const result = await updateUserToken({
      id: userData._id,
      credits: Number(userData.credits) - Number(tokenCount),
    });

    setUserData((prev) => ({
      ...prev,
      credits: Number(userData.credits) - Number(tokenCount),
    }));
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 sm:gap-10">
        <div className="lg:col-span-1">
          <div className=" h-[30vh] sm:h-[60vh] bg-red-300 border rounded-4xl flex flex-col items-center justify-center relative mb-1">
            {expert && (
              <Image
                src={expert?.avatar}
                alt="avatar"
                width={200}
                height={200}
                className="h-[40px] w-[40px]  sm:h-[80px] sm:w-[80px] rounded-full object-cover animate-pulse"
              />
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>
            {/* <audio src={auddioUrl} type="audio/mp3" autoPlay/> */}
            <div className="sm:p-5 bg-gray-200 sm:px-10 rounded-lg absolute bottom-10 right-10 ">
              <UserButton />
            </div>

            {/* <div>
              <Webcam height={170} width={250} className="rounded-2xl"/>
            </div> */}
          </div>

          <FeedBack
            conversation={conversation}
            DiscussionRoomData={DiscussionRoomData}
          />

          {/* <div className="mt-5">
            {!enableMic ? (
              <Button className="cursor-pointer" onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin"/>}Connect
              </Button>
            ) : (
              <Button
                className="cursor-pointer"
                onClick={disconnect}
                variant="destructive"
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin"/>}Disconnect
              </Button>
            )}
          </div> */}
        </div>

        <div className="col-span-2 mb-3 sm:mb-0">
          <ChatBox conversation={conversation} />
          {/* <h2 className="mt-4 text-gray-400 text-sm text-center">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation
          </h2> */}

          <div className="mt-5 flex items-center">
            <Input type="text" placeholder="Enter your doubt" ref={inputRef} />
            <Button
              className="cursor-pointer ml-3"
              onClick={handleSendBtn}
              disabled={loading}
            >
              {loading && <Loader2Icon className="animate-spin" />}Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
