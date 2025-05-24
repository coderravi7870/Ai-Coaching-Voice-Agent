import React, { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import { speakText } from "@/services/GlobalServices";

const ChatBox = ({ conversation,soundShow=true }) => {
  
  const [isSpeacking, setIsSpeacking] = useState(false);
  const [speaking,setSpeaking] = useState(false);

    const prevLength = useRef(0);

  useEffect(() => {
    if (conversation.length > prevLength.current && speaking) {
      const lastMessage = conversation[conversation.length - 1];
      if (lastMessage.role === "assistant") {
        speakText(lastMessage.content,setIsSpeacking,isSpeacking);
      }
      prevLength.current = conversation.length;
    }
  }, [conversation,speaking]);



  return (
    <div className="h-[90vh] sm:h-[60vh] bg-red-300 border rounded-xl p-4 flex flex-col overflow-auto scrollbar-hide relative">
      <div className="sticky -top-2 z-20 flex items-center">
        <div className={`p-2 ml-1 bg-transparent rounded-full cursor-pointer ${soundShow==false && 'hidden'}`}>
          {speaking ? (
            <FaVolumeUp
              size={22}
              onClick={() => setSpeaking(!speaking)}
              className="speaker-icon"
            />
          ) : (
            <FaVolumeMute
              size={22}
              onClick={() => setSpeaking(!speaking)}
              className="speaker-icon"
            />
          )}
        </div>
        
      </div>

      {conversation.map((item, index) => (
        <div className={`flex ${item.role == "user" && "justify-end"}`} key={index}>
          {item.role == "assistant" ? (
            <h2 className="p-1 mt-2 px-2 bg-primary text-white inline-block rounded-md">
              {item?.content}
            </h2>
          ) : (
            <h2 className="p-1 mt-2 px-2 bg-secondary inline-block rounded-md">
              {item?.content}
            </h2>
          )}
        </div>
      ))}

    </div>
  );
};

export default ChatBox;
