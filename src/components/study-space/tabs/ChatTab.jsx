import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function ChatTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineChatBubbleLeftRight}
      title="24/7 AI Chat Tutor"
      description="Ask questions, request simpler explanations, or clarify complex topics in real time."
    />
  );
}
