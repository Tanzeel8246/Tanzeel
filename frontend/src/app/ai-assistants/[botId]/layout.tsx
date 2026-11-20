import { Metadata } from 'next';
import { AI_ASSISTANTS } from '@/config/ai-assistants';

export async function generateMetadata({ params }: { params: Promise<{ botId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const bot = AI_ASSISTANTS.find(b => b.id === resolvedParams.botId);
  
  if (!bot) {
    return {
      title: 'Bot Not Found',
    };
  }

  return {
    title: bot.name,
    description: bot.description,
    openGraph: {
      title: `${bot.name} | CodeHubb Tools`,
      description: bot.description,
      url: `/ai-assistants/${bot.id}`,
    },
    twitter: {
      title: `${bot.name} | CodeHubb Tools`,
      description: bot.description,
    },
  };
}

export default function BotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
