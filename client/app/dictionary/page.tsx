'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DictionaryAPI } from '@/lib/api';
import { Filter, Play, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DictionaryPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [dictionaryItems, setDictionaryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const categoriesData = await DictionaryAPI.getCategories();
        setCategories(categoriesData);

        const itemsResponse = await DictionaryAPI.getItems({
          limit: 100,
          offset: 0,
        });

        setDictionaryItems(itemsResponse.items);
      } catch (error) {
        console.error('Error fetching dictionary data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await DictionaryAPI.searchItems(searchQuery);
        setDictionaryItems(results.items);
      } else {
        const itemsResponse = await DictionaryAPI.getItems({
          category:
            selectedCategory !== 'Tất cả' ? selectedCategory : undefined,
          limit: 100,
          offset: 0,
        });
        setDictionaryItems(itemsResponse.items);
      }
    } catch (error) {
      console.error('Error searching dictionary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    try {
      setLoading(true);
      const itemsResponse = await DictionaryAPI.getItems({
        category: category !== 'Tất cả' ? category : undefined,
        limit: 100,
        offset: 0,
      });
      setDictionaryItems(itemsResponse.items);
    } catch (error) {
      console.error('Error filtering by category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && dictionaryItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
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
                {dictionaryItems.filter(
                  (item) => category === 'Tất cả' || item.category === category,
                ).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Không tìm thấy từ nào trong danh mục này
                    </p>
                  </div>
                )}
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
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
              {item.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
