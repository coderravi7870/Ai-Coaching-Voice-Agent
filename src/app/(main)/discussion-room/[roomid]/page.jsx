"use client";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { CoachingEXpert } from "@/services/Options";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";


import {
  AIModel,

} from "@/services/GlobalServices";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import FeedBack from "./_components/FeedBack";
import { UserContext } from "@/app/_context/UserContext";


const DiscussionRoom = () => {
  const { roomid } = useParams();
  const { userData, setUserData } = useContext(UserContext);
  const [expert, setExpert] = useState();

  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);



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


    setLoading(false);
    inputRef.current.value = "";

    await updateUserTokenMathod(aiResp.content); // update Ai generated Token
  };

  //

  useEffect(() => {
    const updateConversation = async () => {

      if (conversation.length > 0) {
        await UpdateConversation({
          id: DiscussionRoomData?._id,
          conversation: conversation,
        });
      }
    };

    updateConversation();
  }, [conversation]);

 
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
            <div className="sm:p-5 bg-gray-200 sm:px-10 rounded-lg absolute bottom-10 right-10 ">
              <UserButton />
            </div>

 
          </div>

          <FeedBack
            conversation={conversation}
            DiscussionRoomData={DiscussionRoomData}
          />

         
        </div>

        <div className="col-span-2 mb-3 sm:mb-0">
          <ChatBox conversation={conversation} />
         

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
