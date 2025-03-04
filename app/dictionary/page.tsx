import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Play } from 'lucide-react';

export default function DictionaryPage() {
  // Mock dictionary data
  const categories = [
    'Tất cả',
    'Chữ cái',
    'Số',
    'Chào hỏi',
    'Gia đình',
    'Thời gian',
    'Màu sắc',
    'Thực phẩm',
    'Cảm xúc',
    'Câu hỏi',
    'Nơi chốn',
  ];

  const dictionaryItems = [
    {
      id: 1,
      word: 'Xin chào',
      category: 'Chào hỏi',
      description: 'Cử chỉ chào hỏi cơ bản, thường dùng khi gặp ai đó',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 2,
      word: 'Cảm ơn',
      category: 'Chào hỏi',
      description: 'Cử chỉ thể hiện lòng biết ơn',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 3,
      word: 'Tạm biệt',
      category: 'Chào hỏi',
      description: 'Cử chỉ khi chia tay hoặc tạm biệt ai đó',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 4,
      word: 'Gia đình',
      category: 'Gia đình',
      description: 'Ký hiệu cho từ gia đình',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 5,
      word: 'Bố/Cha',
      category: 'Gia đình',
      description: 'Ký hiệu chỉ người cha trong gia đình',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 6,
      word: 'Mẹ',
      category: 'Gia đình',
      description: 'Ký hiệu chỉ người mẹ trong gia đình',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 7,
      word: 'Vui',
      category: 'Cảm xúc',
      description: 'Ký hiệu thể hiện cảm xúc vui vẻ, hạnh phúc',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 8,
      word: 'Buồn',
      category: 'Cảm xúc',
      description: 'Ký hiệu thể hiện cảm xúc buồn bã',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 9,
      word: 'Giận dữ',
      category: 'Cảm xúc',
      description: 'Ký hiệu thể hiện cảm xúc tức giận',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 10,
      word: 'Yêu',
      category: 'Cảm xúc',
      description: 'Ký hiệu thể hiện tình yêu thương',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 11,
      word: 'Một',
      category: 'Số',
      description: 'Ký hiệu cho số 1',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 12,
      word: 'Hai',
      category: 'Số',
      description: 'Ký hiệu cho số 2',
      videoUrl: '/placeholder.mp4',
      thumbnail: '/placeholder.svg?height=150&width=200',
    },
  ];

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Từ điển ngôn ngữ ký hiệu
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Khám phá và học các từ và cụm từ phổ biến trong ngôn ngữ ký hiệu
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm từ..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>

          <Tabs defaultValue="Tất cả" className="w-full">
            <div className="overflow-auto pb-2">
              <TabsList className="inline-flex w-max">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dictionaryItems
                    .filter(
                      (item) =>
                        category === 'Tất cả' || item.category === category,
                    )
                    .map((item) => (
                      <DictionaryCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  );
}

function DictionaryCard({ item }: { item: any }) {
  return (
    <Link href={`/dictionary/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-video bg-muted">
          <img
            src={item.thumbnail || '/placeholder.svg'}
            alt={item.word}
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute inset-0 m-auto bg-black/50 hover:bg-black/70 text-white h-10 w-10 rounded-full"
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{item.word}</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
