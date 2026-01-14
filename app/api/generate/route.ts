import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const TONE_PROMPTS: Record<string, string> = {
  professional: 'professional and polished, suitable for LinkedIn-style audiences',
  casual: 'casual and conversational, like talking to a friend',
  witty: 'witty and clever with a touch of humor',
  inspiring: 'inspiring and motivational',
  controversial: 'bold and provocative, a hot take that sparks discussion',
  informative: 'informative and educational, sharing valuable insights',
  storytelling: 'narrative style, telling a mini story',
  promotional: 'promotional but not salesy, highlighting value',
};

const MAX_POST_LENGTH = 280;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { topic, tone } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const toneDescription = TONE_PROMPTS[tone] || TONE_PROMPTS.casual;
    
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      // Fallback: generate simple variations without AI
      const posts = generateFallbackPosts(topic, tone);
      return NextResponse.json({ tweets: posts });
    }

    // Use OpenAI
    const prompt = `Generate 3 unique posts for X (formerly Twitter) about the following topic. Each post should be ${toneDescription}. Keep each under ${MAX_POST_LENGTH} characters. Do not use hashtags unless specifically relevant. Do not use emojis excessively.

Topic: ${topic}

Return ONLY a JSON array of 3 strings, nothing else. Example format:
["Post 1 text here", "Post 2 text here", "Post 3 text here"]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a social media expert who writes engaging posts for X. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI error:', await response.text());
      // Fallback on error
      const posts = generateFallbackPosts(topic, tone);
      return NextResponse.json({ tweets: posts });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      const posts = JSON.parse(content);
      if (Array.isArray(posts) && posts.length > 0) {
        return NextResponse.json({ tweets: posts.slice(0, 3) });
      }
    } catch {
      console.error('Failed to parse OpenAI response:', content);
    }

    // Fallback
    const posts = generateFallbackPosts(topic, tone);
    return NextResponse.json({ tweets: posts });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function generateFallbackPosts(topic: string, tone: string): string[] {
  const cleanTopic = topic.trim().slice(0, 200);
  
  const templates: Record<string, string[]> = {
    professional: [
      `Key insight on ${cleanTopic}: The most successful approach focuses on sustainable value creation.`,
      `${cleanTopic} — a topic worth exploring. Here's what the data tells us about best practices.`,
      `After years in this space, here's my take on ${cleanTopic}: execution beats perfection every time.`,
    ],
    casual: [
      `Been thinking about ${cleanTopic} lately and honestly? It's wild how much potential there is here.`,
      `${cleanTopic} hits different when you actually take time to understand it properly.`,
      `Hot take: ${cleanTopic} is way more interesting than people give it credit for.`,
    ],
    witty: [
      `${cleanTopic}: because apparently we needed another thing to have opinions about.`,
      `Me explaining ${cleanTopic} to my friends: "Trust me bro, it makes sense."`,
      `${cleanTopic} is basically that friend who's late to everything but somehow makes it work.`,
    ],
    inspiring: [
      `${cleanTopic} reminds us that every big change starts with a single step forward.`,
      `What excites me about ${cleanTopic}: the possibility to create something meaningful.`,
      `The future of ${cleanTopic} is being written right now. Be part of it.`,
    ],
    controversial: [
      `Unpopular opinion: most people are approaching ${cleanTopic} completely wrong.`,
      `${cleanTopic} — let's be honest about what's actually working and what's just hype.`,
      `Hot take on ${cleanTopic}: the conventional wisdom is holding everyone back.`,
    ],
    informative: [
      `Quick breakdown of ${cleanTopic}: here's what you actually need to know.`,
      `${cleanTopic} explained: the fundamentals matter more than the trends.`,
      `Understanding ${cleanTopic} starts with asking the right questions.`,
    ],
    storytelling: [
      `I remember when I first encountered ${cleanTopic}. It changed how I think about everything.`,
      `${cleanTopic} — a journey that started small but led somewhere unexpected.`,
      `The story of ${cleanTopic} is really a story about people and persistence.`,
    ],
    promotional: [
      `Excited to share my thoughts on ${cleanTopic}. This could be a game-changer.`,
      `${cleanTopic} is where the opportunity is right now. Here's why it matters.`,
      `If you're sleeping on ${cleanTopic}, you might want to reconsider.`,
    ],
  };

  return templates[tone] || templates.casual;
}
