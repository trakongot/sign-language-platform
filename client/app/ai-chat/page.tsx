'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, ImageIcon, Mic, Send, Video } from 'lucide-react';
import { useState } from 'react';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content:
        'Xin chào! Tôi là trợ lý AI ngôn ngữ ký hiệu. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: '10:30 AM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const botResponses = [
        'Tôi có thể giúp bạn học các ký hiệu cơ bản trong ngôn ngữ ký hiệu. Bạn muốn bắt đầu với chủ đề nào?',
        'Để học ngôn ngữ ký hiệu hiệu quả, bạn nên thực hành thường xuyên và xem các video hướng dẫn.',
        'Tôi có thể giải thích cách thể hiện từ đó trong ngôn ngữ ký hiệu. Bạn có muốn xem video minh họa không?',
        'Ngôn ngữ ký hiệu có nhiều biến thể khác nhau tùy theo từng quốc gia. Bạn đang học ngôn ngữ ký hiệu của nước nào?',
      ];

      const botMessage = {
        id: messages.length + 2,
        role: 'bot',
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Trò chuyện với AI
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Đặt câu hỏi và nhận hướng dẫn từ trợ lý AI ngôn ngữ ký hiệu của
              chúng tôi
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Trợ lý AI ngôn ngữ ký hiệu</CardTitle>
                <CardDescription>
                  Hỏi bất kỳ câu hỏi nào về ngôn ngữ ký hiệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-[400px] overflow-y-auto p-4 border rounded-md">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'flex-row-reverse'
                            : 'flex-row'
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          {message.role === 'bot' ? (
                            <>
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="AI Assistant"
                              />
                              <AvatarFallback>AI</AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="User"
                              />
                              <AvatarFallback>U</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
                <CardDescription>
                  Các câu hỏi phổ biến về ngôn ngữ ký hiệu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Làm thế nào để bắt đầu học ngôn ngữ ký hiệu?',
                  'Có bao nhiêu loại ngôn ngữ ký hiệu trên thế giới?',
                  'Ngôn ngữ ký hiệu có phải là ngôn ngữ phổ quát không?',
                  'Mất bao lâu để thành thạo ngôn ngữ ký hiệu?',
                  'Làm thế nào để thực hành ngôn ngữ ký hiệu hàng ngày?',
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-2 px-4"
                    onClick={() => {
                      setInputValue(question);
                    }}
                  >
                    <span className="truncate">{question}</span>
                  </Button>
                ))}
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-center w-full gap-2 p-4 bg-muted rounded-lg">
                  <Bot className="h-8 w-8 text-primary" />
                  <p className="text-sm text-center">
                    Trợ lý AI của chúng tôi được đào tạo để trả lời các câu hỏi
                    về ngôn ngữ ký hiệu và hỗ trợ quá trình học tập của bạn.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
