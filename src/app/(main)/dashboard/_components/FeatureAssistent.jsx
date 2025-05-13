"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { ExpertList } from "@/services/Options";
import { useUser } from "@stackframe/stack";
import Image from "next/image";
import React from "react";
import UserInputDialog from "./UserInputDialog";
import ProfileDialog from "./ProfileDialog";

const FeatureAssistent = () => {
  const user = useUser();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-medium text-gray-500">Your Working space</h1>
          <h2 className="text-3xl font-bold">
            Most Welcome, {user?.displayName}
          </h2>
        </div>
        <ProfileDialog>
          <Button>Profile</Button>
        </ProfileDialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mt-10">
        {ExpertList.map((option, index) => (
          <BlurFade key={index} delay={0.25 + index * 0.05} inView>
            <div className="p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center">
              <UserInputDialog coachingOption={option}>
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={option.icon}
                    alt={option.name}
                    width={150}
                    height={150}
                    className="h-[70px] w-[70px] hover:rotate-12 cursor-pointer transition-all"
                  />
                  <h2 className="mt-2">{option.name}</h2>
                </div>
              </UserInputDialog>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default FeatureAssistent;
