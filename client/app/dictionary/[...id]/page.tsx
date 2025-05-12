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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DictionaryAPI } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  MessageSquare,
  Play,
  RotateCcw,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VocabularyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [vocabularyItem, setVocabularyItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDictionaryItem() {
      try {
        setLoading(true);
        setError(null);

        const itemId = parseInt(id, 10);
        if (isNaN(itemId)) {
          setError('ID không hợp lệ');
          return;
        }

        const response = await DictionaryAPI.getItemById(itemId);
        setVocabularyItem(response.item);
      } catch (err) {
        console.error('Failed to fetch dictionary item:', err);
        setError('Không thể tải dữ liệu từ điển.');
      } finally {
        setLoading(false);
      }
    }

    fetchDictionaryItem();
  }, [id]);

  // Function to check if a URL is a YouTube URL
  const isYouTubeUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || !vocabularyItem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || 'Không tìm thấy từ vựng'}
          </p>
          <Button variant="outline" onClick={() => router.push('/dictionary')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại từ điển
          </Button>
        </div>
      </div>
    );
  }

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
                          {vocabularyItem.difficulty || 'Dễ'}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {vocabularyItem.likes || 0}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {vocabularyItem.comments || 0}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {vocabularyItem.views || 0} lượt xem
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-md bg-black aspect-video">
                    {isYouTubeUrl(vocabularyItem.videoUrl) ? (
                      <iframe
                        className="w-full h-full"
                        src={vocabularyItem.videoUrl}
                        title={vocabularyItem.word}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        className="w-full h-full"
                        src={vocabularyItem.videoUrl || '/placeholder.mp4'}
                        controls
                        playsInline
                        loop
                      >
                        <source
                          src={vocabularyItem.videoUrl || '/placeholder.mp4'}
                          type="video/mp4"
                        />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" size="sm">
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
                        {(vocabularyItem.examples || []).map(
                          (example: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                                {index + 1}
                              </span>
                              <span>{example}</span>
                            </li>
                          ),
                        )}
                        {(vocabularyItem.examples || []).length === 0 && (
                          <p className="text-muted-foreground">
                            Chưa có ví dụ nào cho từ này
                          </p>
                        )}
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
                        {(vocabularyItem.tips || []).map(
                          (tip: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                                {index + 1}
                              </span>
                              <span>{tip}</span>
                            </li>
                          ),
                        )}
                        {(vocabularyItem.tips || []).length === 0 && (
                          <p className="text-muted-foreground">
                            Chưa có mẹo thực hành nào cho từ này
                          </p>
                        )}
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
                  {(vocabularyItem.relatedWords || []).map((word: any) => (
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
                  {(vocabularyItem.relatedWords || []).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Không có từ liên quan
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/dictionary')}
                  >
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
