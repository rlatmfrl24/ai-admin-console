'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import FloatingChatImage from '@/assets/img-floating-chat.svg';
import { useAuthStore } from '@/lib/store/authStore';

export default function FloatingChatButton() {
  const pathname = usePathname();
  const isChatPage = pathname.includes(
    '/response-management/response-extraction-process/ai-chatbot-test',
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isChatPage || !isAuthenticated ? null : (
    <Link
      href="/response-management/response-extraction-process/ai-chatbot-test"
      style={{
        position: 'fixed',
        top: 'calc(50% - 92.5px)',
        right: 0,
        zIndex: 1000,
      }}
    >
      <FloatingChatImage />
    </Link>
  );
}
