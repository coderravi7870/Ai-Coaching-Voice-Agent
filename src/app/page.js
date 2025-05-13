"use client";
import { UserButton, useUser } from "@stackframe/stack";
import React, { useContext } from "react";
import AppHeader from "./(main)/_components/AppHeader";
import { Button } from "@/components/ui/button";
import { UserContext } from "./_context/UserContext";
import Link from "next/link";
import { CoachingEXpert } from "@/services/Options";
import Image from "next/image";

const Home = () => {
  const { userData } = useContext(UserContext);

  return (
    <div>
      <AppHeader />
      <div className="sm:p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-72">
        <div className="text-center font-bold">
          <h2 className="text-4xl font-extrabold  bg-clip-text bg-gradient-to-r">
            Revolutionize Learning with{" "}
          </h2>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI-Powered Voice Agent
          </h2>
        </div>

        <div className="text-center mt-5">
          {userData ? (
            <Button className="cursor-pointer">
              <Link href={"/dashboard"}>Get Started!</Link>
            </Button>
          ) : (
            <div className="p-2  flex items-center justify-center">
              <div className=" p-4 bg-primary w-12 h-12 flex justify-center items-center rounded-2xl">
                <UserButton />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap mt-10 gap-7 justify-center">
          {CoachingEXpert.map((item, index) => (
            <div key={index}>
              <Image
                src={item.avatar}
                alt="pic"
                width={200}
                height={400}
                className="rounded-xl w-[200px] h-[300px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
