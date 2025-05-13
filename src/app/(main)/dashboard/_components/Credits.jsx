import { UserContext } from "@/app/_context/UserContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { useUser } from "@stackframe/stack";
import axios from "axios";
import { useMutation } from "convex/react";
import { Loader2Icon, Wallet2 } from "lucide-react";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";

const Credits = () => {
  const { userData } = useContext(UserContext);
  const user = useUser();
  const [loading,setLoading] = useState(false);

  const update_Credits_Subscription = useMutation(api.users.updateCreditsAndSubscription);

  const CalculateProgress = () => {
    if (userData?.subscriptionId) {
      // console.log((userData?.credits / 50000) * 100);
      return (userData?.credits / 50000) * 100;
    }
    const cal = ((5000 - (50000 - userData?.credits)) / 5000) * 100;
    // console.log(cal);
    return cal;
  };

  const handleUpgrade = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your internet.");
      return;
    }
    setLoading(true);
    const { data } = await axios.post("/api/razorpay", {
      amount: 853,
      userid: userData._id,
    });

    const { order } = data;
    console.log("orderData", order);
    setLoading(false);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: process.env.NEXT_PUBLIC_CURRENCY,
      name: "ai-coaching-voice-agent",
      description: "Upgrade to Pro Plan of ai-coaching-voice-agent",
      order_id: order.id,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post("api/verifyPayment", { response });
          console.log("data", data);
          if(data?.success){
            await update_Credits_Subscription({
              id: userData._id,
              credits: 50000,
              subscriptionId: response?.razorpay_payment_id
            })
            toast("Payment Successfull");
          }else{
            toast("Payment Failed");
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to process payment!");
        }
      },
      prefill: {
        name: user?.displayName,
        email: user?.primaryEmail,
      },
      theme: {
        color: "#6366F1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <div className="flex gap-5 items-center">
        <Image
          src={user?.profileImageUrl}
          alt="profile"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-bold">{user?.displayName}</h2>
          <h2 className="text-gray-500">{user?.primaryEmail}</h2>
        </div>
      </div>
      <hr className="my-3" />
      <div>
        <h2 className="font-bold">Token Usage</h2>
        <h2>
          {userData?.subscriptionId
            ? userData?.credits
            : 5000 - (50000 - userData?.credits)}
          /{userData?.subscriptionId ? "50,000" : "5,000"}
        </h2>
        <Progress value={CalculateProgress()} className="my-3" />

        <div className="flex justify-between items-center mt-3">
          <h2 className="font-bold">Current Plan</h2>
          <h2 className="p-1 bg-secondary rounded-lg px-2 ">
            {userData?.subscriptionId ? "Paid Plan" : "Free Plan"}
          </h2>
        </div>

        <div className="mt-5 p-5 border rounded-2xl">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold">Pro Plan</h2>
              <h2>50,000 Tokens</h2>
            </div>
            <h2 className="font-bold">$10/Month</h2>
          </div>
          <hr className="my-3" />
          <Button className="w-full cursor-pointer" onClick={handleUpgrade} disabled={loading}>
            {loading && <Loader2Icon className="animate-spin"/>}<Wallet2 /> Upgrade $10
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Credits;
