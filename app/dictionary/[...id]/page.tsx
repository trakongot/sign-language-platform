'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Share2,
  ThumbsUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function VocabularyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data for the vocabulary item
  const vocabularyItem = {
    id: Number.parseInt(id),
    word:
      id === '1'
        ? 'Xin chào'
        : id === '2'
        ? 'Cảm ơn'
        : id === '3'
        ? 'Tạm biệt'
        : 'Từ vựng',
    category: 'Chào hỏi',
    description:
      'Đây là một trong những cử chỉ cơ bản nhất trong ngôn ngữ ký hiệu, thường được sử dụng khi gặp ai đó. Cử chỉ này được thực hiện bằng cách đưa bàn tay phải lên ngang trán, lòng bàn tay hướng ra ngoài, sau đó di chuyển ra xa khỏi khuôn mặt.',
    videoUrl: '/placeholder.mp4',
    examples: [
      'Xin chào, tôi tên là [tên của bạn]',
      'Xin chào, rất vui được gặp bạn',
      'Xin chào, bạn khỏe không?',
    ],
    tips: [
      'Đảm bảo lòng bàn tay hướng ra ngoài, không hướng vào mặt bạn',
      'Chuyển động nên tự nhiên và nhẹ nhàng',
      'Biểu cảm khuôn mặt cũng rất quan trọng - hãy mỉm cười khi thực hiện cử chỉ này',
    ],
    relatedWords: [
      { id: 2, word: 'Cảm ơn', category: 'Chào hỏi' },
      { id: 3, word: 'Tạm biệt', category: 'Chào hỏi' },
      { id: 4, word: 'Rất vui được gặp bạn', category: 'Chào hỏi' },
    ],
    difficulty: 'Dễ',
    views: 1245,
    likes: 328,
    comments: 42,
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handlePlaybackRateChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value[0];
      setPlaybackRate(value[0]);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    // Reset video state when the component mounts
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      setPlaybackRate(1);
      videoRef.current.playbackRate = 1;
    }
  }, []);

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại từ điển
            </Button>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                {vocabularyItem.word}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl">
                        {vocabularyItem.word}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {vocabularyItem.category}
                        </Badge>
                        <Badge variant="secondary">
                          {vocabularyItem.difficulty}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {vocabularyItem.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {vocabularyItem.comments}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {vocabularyItem.views} lượt xem
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-md bg-black aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      playsInline
                      loop
                    >
                      <source src="/placeholder.mp4" type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex flex-col gap-2">
                        <Slider
                          value={[progress]}
                          max={100}
                          step={0.1}
                          onValueChange={handleProgressChange}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={togglePlay}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={restartVideo}
                              className="text-white hover:bg-white/20"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleMute}
                              className="text-white hover:bg-white/20"
                            >
                              {isMuted ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white">
                              {playbackRate}x
                            </span>
                            <Slider
                              value={[playbackRate]}
                              min={0.25}
                              max={2}
                              step={0.25}
                              onValueChange={handlePlaybackRateChange}
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" size="sm" onClick={restartVideo}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Xem lại
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Thêm vào danh sách học
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Chia sẻ
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="examples">Ví dụ</TabsTrigger>
                  <TabsTrigger value="tips">Mẹo thực hành</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mô tả</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{vocabularyItem.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="examples" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ví dụ sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {vocabularyItem.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                              {index + 1}
                            </span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tips" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mẹo thực hành</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {vocabularyItem.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                              {index + 1}
                            </span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Thực hành ngay
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Từ liên quan</CardTitle>
                  <CardDescription>
                    Các từ vựng liên quan đến "{vocabularyItem.word}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vocabularyItem.relatedWords.map((word) => (
                    <Link href={`/dictionary/${word.id}`} key={word.id}>
                      <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium">{word.word}</p>
                          <p className="text-sm text-muted-foreground">
                            {word.category}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Xem thêm từ vựng
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thực hành</CardTitle>
                  <CardDescription>Kiểm tra kiến thức của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-center p-4">
                      Bật camera để thực hành và nhận phản hồi tức thì
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Bắt đầu thực hành</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
