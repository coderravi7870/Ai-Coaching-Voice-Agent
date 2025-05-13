import { Button } from "@/components/ui/button";
import { AIModelToGenerateFeedBackAndNotes } from "@/services/GlobalServices";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";

const FeedBack = ({ conversation, DiscussionRoomData }) => {
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const UpdateSummery = useMutation(api.DiscussionRoom.UpdateSummery);
  const { roomid } = useParams();

  const GenerateFeedBackNotes = async () => {
    setFeedbackLoading(true);
    try {
      const result = await AIModelToGenerateFeedBackAndNotes(
        DiscussionRoomData?.coachingOption,
        conversation
      );

      console.log(result.content);
      await UpdateSummery({
        id: roomid,
        summery: result.content,
      });
      setFeedbackLoading(false);
      toast("Feedback/Notes Saved!");
    } catch (error) {
        console.log(error)
      setFeedbackLoading(false);
      toast("Internal server error, Try again");
    }
  };

  return (
    <div>
      <Button
        className="cursor-pointer"
        disabled={conversation.length == 0 || feedbackLoading}
        onClick={GenerateFeedBackNotes}
      >
        {feedbackLoading && <Loader2Icon className="animate-spin" />}Generate
        Feedback/Notes
      </Button>
    </div>
  );
};

export default FeedBack;
