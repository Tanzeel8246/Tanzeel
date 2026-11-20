import { streamText, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AI_ASSISTANTS } from '@/config/ai-assistants';
import { getSettings } from '@/lib/settings-store';

// Helper function to pick a random key from a comma-separated list
function getRandomKey(envVarName: string): string | null {
  const settings = getSettings();
  let keysString = process.env[envVarName] || '';
  if (envVarName === 'GROQ_API_KEYS' && settings.groqApiKeys) {
    keysString = settings.groqApiKeys;
  } else if (envVarName === 'GEMINI_API_KEYS' && settings.geminiApiKeys) {
    keysString = settings.geminiApiKeys;
  }
  const keys = keysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  if (keys.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

// Health check endpoint
export async function GET() {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'Chat API is running and healthy',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function resolveBotId(id: string): string {
  const normalized = (id || '').toLowerCase().trim();
  if (normalized === 'translator' || normalized === 'urdu-translator') return 'urdu-translator';
  if (normalized === 'tutor' || normalized === 'master-tutor') return 'master-tutor';
  if (normalized === 'khutbat' || normalized === 'khutbat-e-jumuah' || normalized === 'khutba') return 'khutbat-e-jumuah';
  if (normalized === 'tanzeel' || normalized === 'tanzeel-ai') return 'tanzeel-ai';
  return id;
}

// Helper to determine model per assistant
function getModelForBot(botId: string): string {
  const id = resolveBotId(botId);
  const settings = getSettings();
  switch (id) {
    case 'tanzeel-ai':
      return settings.aiModelTanzeel || process.env.AI_MODEL_TANZEEL || 'llama-3.3-70b-versatile';
    case 'urdu-translator':
      return settings.aiModelTranslator || process.env.AI_MODEL_TRANSLATOR || 'llama-3.3-70b-versatile';
    case 'master-tutor':
      return settings.aiModelTutor || process.env.AI_MODEL_TUTOR || 'llama-3.3-70b-versatile';
    case 'khutbat-e-jumuah':
      return settings.aiModelKhutbat || process.env.AI_MODEL_KHUTBAT || 'llama-3.3-70b-versatile';
    default:
      return settings.aiModelTanzeel || 'llama-3.3-70b-versatile';
  }
}

export async function POST(req: Request) {
  try {
    let json: any;
    try {
      json = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages, botId } = json;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetBotId = resolveBotId(botId || 'tanzeel-ai');
    const bot = AI_ASSISTANTS.find(b => b.id === targetBotId);
    if (!bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = bot.systemPrompt;
    
    // Normalize incoming messages for Vercel AI SDK v4 compatibility (supports both content and parts)
    const normalizedMessages = messages.map((m: any, i: number) => {
      if (!m.parts && m.content) {
        return {
          ...m,
          id: m.id || `msg-${Date.now()}-${i}`,
          parts: typeof m.content === 'string'
            ? [{ type: 'text', text: m.content }]
            : m.content,
        };
      }
      return m;
    });

    const coreMessages = await convertToModelMessages(normalizedMessages);

    // Inject feedback notes for AI preference learning
    coreMessages.forEach((msg, idx) => {
      const originalMsg = messages[idx];
      if (originalMsg && originalMsg.annotations) {
        const ratingAnnotation = originalMsg.annotations.find((a: any) => a.type === 'rating');
        if (ratingAnnotation && msg.role === 'assistant') {
          const feedback = ratingAnnotation.value === 1 ? 'liked' : 'disliked';
          if (typeof msg.content === 'string') {
            msg.content += `\n\n[System Note: The user ${feedback} this specific response style/content. Use this feedback to adapt your future responses.]`;
          } else if (Array.isArray(msg.content)) {
            msg.content.push({ type: 'text', text: `\n\n[System Note: The user ${feedback} this specific response style/content. Use this feedback to adapt your future responses.]` });
          }
        }
      }
    });

    // Save user message if logged in — wrapped in isolated try/catch so DB errors never crash the AI response
    let chatSessionId: string | null = null;
    try {
      const { getServerSession } = await import('next-auth');
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
      const prismaModule = await import('@/lib/prisma');
      const prisma = prismaModule.default || prismaModule.prisma;
      
      const session = await getServerSession(authOptions);
      if (session?.user?.email && prisma) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (user) {
          const chatSession = await prisma.chatSession.upsert({
            where: {
              userId_botId: { userId: user.id, botId: bot.id },
            },
            update: {},
            create: {
              userId: user.id,
              botId: bot.id,
            },
          });
          chatSessionId = chatSession.id;

          const latestMessage = messages[messages.length - 1];
          if (latestMessage && latestMessage.role === 'user') {
            const userContent = latestMessage.parts ? latestMessage.parts.map((p: any) => p.text).join('') : latestMessage.content;
            await prisma.chatMessage.create({
              data: {
                chatSessionId,
                role: 'user',
                content: userContent,
              },
            });
          }
        }
      }
    } catch (dbError) {
      console.warn('Non-fatal error saving user message to database:', dbError);
    }

    const groqKey = getRandomKey('GROQ_API_KEYS');
    const geminiKey = getRandomKey('GEMINI_API_KEYS');

    if (!groqKey && !geminiKey) {
      return new Response(JSON.stringify({
        error: 'اس وقت AI سروس دستیاب نہیں ہے (API کیز تشکیل شدہ نہیں ہیں)۔ براہ کرم ایڈمن سے رابطہ کریں۔',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const onFinishSave = async ({ text }: { text: string }) => {
      if (chatSessionId) {
        try {
          const prismaModule = await import('@/lib/prisma');
          const prisma = prismaModule.default || prismaModule.prisma;
          if (prisma) {
            await prisma.chatMessage.create({
              data: {
                chatSessionId,
                role: 'assistant',
                content: text,
              },
            });
          }
        } catch (e) {
          console.warn("Non-fatal: Failed to save AI response to DB:", e);
        }
      }
    };

    // Attempt 1: Groq with fast Qwen 3.8 / LLama
    if (groqKey) {
      try {
        const groq = createOpenAI({
          baseURL: 'https://api.groq.com/openai/v1',
          apiKey: groqKey,
        });

        const groqModel = getModelForBot(bot.id);

        const result = await streamText({
          model: groq(groqModel),
          messages: coreMessages,
          system: systemPrompt,
          maxOutputTokens: 8000,
          onFinish: onFinishSave,
        });

        return result.toUIMessageStreamResponse();
      } catch (groqError: any) {
        console.warn('Groq stream failed, attempting Gemini fallback:', groqError.message || groqError);
      }
    }

    // Attempt 2: Google Gemini Fallback
    if (geminiKey) {
      try {
        const google = createGoogleGenerativeAI({
          apiKey: geminiKey,
        });

        const geminiModel = getSettings().aiModelGemini || process.env.AI_MODEL_GEMINI || 'gemini-2.0-flash';

        const result = await streamText({
          model: google(geminiModel),
          messages: coreMessages,
          system: systemPrompt,
          maxOutputTokens: 8000,
          onFinish: onFinishSave,
        });

        return result.toUIMessageStreamResponse();
      } catch (geminiError: any) {
        console.error('Gemini stream failed:', geminiError.message || geminiError);
      }
    }

    return new Response(JSON.stringify({
      error: 'اس وقت تمام AI فراہم کنندگان مصروف ہیں۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔',
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Critical Chat API Error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'سرور پر غیر متوقع خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
