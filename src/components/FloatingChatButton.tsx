import FloatingChatImage from "@/assets/img-floating-chat.svg";
import Link from "next/link";

export default function FloatingChatButton() {
  return (
    <Link
      href="/response-management/response-extraction-process/ai-chatbot-test"
      style={{
        position: "fixed",
        top: "calc(50% - 92.5px)",
        right: 0,
        zIndex: 1000,
      }}
    >
      <FloatingChatImage />
    </Link>
  );
}
