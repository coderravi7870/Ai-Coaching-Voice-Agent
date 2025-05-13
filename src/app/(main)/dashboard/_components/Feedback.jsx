"use client";
import { UserContext } from "@/app/_context/UserContext";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { ExpertList } from "@/services/Options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";

const Feedback = () => {
  const convex = useConvex();
  const { userData } = useContext(UserContext);

  const [discussionRoomList, setDiscussionRoomList] = useState([]);

  useEffect(() => {
    userData && GetDiscussionRooms();
  }, [userData]);

  const GetDiscussionRooms = async () => {
    const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom, {
      id: userData?._id,
    });

    setDiscussionRoomList(result);
  };

  const GetAbstractImages = (option) => {
    const coachingOption = ExpertList.find((item) => item.name == option);
    return coachingOption?.abstract ?? "/ab1.png";
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Feedback</h2>
      {discussionRoomList?.length == 0 && (
        <h2 className="text-gray-400">Not any previous Feedback</h2>
      )}

      <div className="mt-5">
        {discussionRoomList.map(
          (item, index) =>
            (item.coachingOption == "Mock Interview" ||
              item.coachingOption == "Questinn Ans Prep") && (
              <div
                key={index}
                className="border-b-[1px] pb-3 mb-4 flex justify-between items-center group cursor-pointer"
              >
                <div className="flex gap-7 items-center">
                  <Image
                    src={GetAbstractImages(item.coachingOption)}
                    alt="abstract"
                    width={70}
                    height={70}
                    className="rounded-full w-[50px] h-[50px]"
                  />
                  <div>
                    <h2 className="font-bold">{item.topic}</h2>
                    <h2 className="text-gray-400">{item.coachingOption}</h2>
                    <h2 className="text-gray-400 text-sm">
                      {moment(item._creationTime).fromNow()}
                    </h2>
                  </div>
                </div>

                <Link href={"/view-summery/" + item._id}>
                  <Button
                    variant="outline"
                    className="invisible group-hover:visible"
                  >
                    View Notes
                  </Button>
                </Link>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Feedback;
