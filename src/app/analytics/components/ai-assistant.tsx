'use client';

import { useState } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';
import { Input } from '@/shared/components/shadcn/input';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hey! I'm BeatBuddy, your analytics assistant. Ask me anything about your music's performance, like 'Why did my streams spike last week?' or 'Which country should I target next?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const suggestedQuestions = [
    'Why did my streams drop on Spotify?',
    'Which country should I target next?',
    'How can I increase my TikTok creations?',
    'Which songs perform best in Reels vs Shorts?',
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'streams drop':
          'Based on your data, your Spotify streams decreased by 15% last week. This coincided with the end of your playlist feature on "Summer Vibes" (2.4M followers). Consider reaching out to curators for similar playlists or running a Show.co campaign to regain momentum.',
        'country target':
          "Brazil shows the strongest growth (+67% week-over-week), especially on Instagram Reels. I'd recommend targeting Brazil with localized content and potentially translating your bio. Want me to help you set up a Show.co campaign?",
        'tiktok':
          'Your TikTok creations are up 24% this week! To boost further: 1) Engage with top creators using your sound, 2) Create a TikTok challenge, 3) Share behind-the-scenes content. Your track "Midnight Drive" is resonating - capitalize on it!',
        'reels shorts':
          'Great question! "Ocean Waves" performs 32% better on Shorts (avg 45K views) vs Reels (34K views), while "City Lights" crushes it on Reels (+28% engagement). The slower tempo works better for Shorts, faster beats for Reels.',
      };

      let responseContent =
        "That's an interesting question! Based on your analytics, I can see patterns in your data that might help. However, this is a demo with mock responses. In production, I'd provide detailed insights based on your real-time data.";

      // Match keywords to provide relevant responses
      const lowerInput = input.toLowerCase();
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowerInput.includes(keyword)) {
          responseContent = response;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);

    // Automatically send the message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'streams drop':
          'Based on your data, your Spotify streams decreased by 15% last week. This coincided with the end of your playlist feature on "Summer Vibes" (2.4M followers). Consider reaching out to curators for similar playlists or running a Show.co campaign to regain momentum.',
        'country target':
          "Brazil shows the strongest growth (+67% week-over-week), especially on Instagram Reels. I'd recommend targeting Brazil with localized content and potentially translating your bio. Want me to help you set up a Show.co campaign?",
        'tiktok':
          'Your TikTok creations are up 24% this week! To boost further: 1) Engage with top creators using your sound, 2) Create a TikTok challenge, 3) Share behind-the-scenes content. Your track "Midnight Drive" is resonating - capitalize on it!',
        'reels shorts':
          'Great question! "Ocean Waves" performs 32% better on Shorts (avg 45K views) vs Reels (34K views), while "City Lights" crushes it on Reels (+28% engagement). The slower tempo works better for Shorts, faster beats for Reels.',
      };

      let responseContent =
        "That's an interesting question! Based on your analytics, I can see patterns in your data that might help. However, this is a demo with mock responses. In production, I'd provide detailed insights based on your real-time data.";

      // Match keywords to provide relevant responses
      const lowerInput = question.toLowerCase();
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowerInput.includes(keyword)) {
          responseContent = response;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: 'var(--cdbaby-purple)' }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[400px] shadow-2xl animate-in slide-in-from-bottom-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="rounded-lg bg-[var(--cdbaby-purple)]/10 p-2">
            <Sparkles className="h-5 w-5 text-[var(--cdbaby-purple)]" />
          </div>
          BeatBuddy
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-[400px] space-y-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-[var(--cdbaby-light-blue)] text-white'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-[2.5rem] whitespace-normal text-left text-xs py-2 px-3"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your analytics..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="flex-shrink-0"
            style={{ backgroundColor: 'var(--cdbaby-purple)' }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
