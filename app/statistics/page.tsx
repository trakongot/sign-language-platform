import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Calendar, Clock, LineChart, PieChart, TrendingUp, Users } from "lucide-react"

export default function StatisticsPage() {
  // Mock data for statistics
  const learningStats = {
    totalLearningTime: "42 giờ",
    lessonsCompleted: 24,
    averageScore: 85,
    currentStreak: 28,
    longestStreak: 35,
    practiceSessionsCompleted: 56,
    translationsCompleted: 38,
    weeklyProgress: [65, 70, 75, 68, 80, 85, 82],
    monthlyProgress: [
      { month: "Tháng 1", progress: 45 },
      { month: "Tháng 2", progress: 58 },
      { month: "Tháng 3", progress: 65 },
      { month: "Tháng 4", progress: 72 },
      { month: "Tháng 5", progress: 80 },
      { month: "Tháng 6", progress: 85 },
    ],
    categoryProgress: [
      { category: "Chữ cái", progress: 90 },
      { category: "Số", progress: 85 },
      { category: "Chào hỏi", progress: 95 },
      { category: "Gia đình", progress: 75 },
      { category: "Thời gian", progress: 60 },
      { category: "Màu sắc", progress: 80 },
    ],
  }

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Thống kê học tập</h1>
            <p className="text-muted-foreground md:text-xl">
              Theo dõi tiến trình học tập và hiệu suất của bạn qua thời gian
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thời gian học</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningStats.totalLearningTime}</div>
                <p className="text-xs text-muted-foreground">+2.5 giờ so với tuần trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bài học đã hoàn thành</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningStats.lessonsCompleted}</div>
                <p className="text-xs text-muted-foreground">+3 bài học so với tuần trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningStats.averageScore}%</div>
                <p className="text-xs text-muted-foreground">+5% so với tuần trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chuỗi ngày học liên tiếp</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningStats.currentStreak} ngày</div>
                <p className="text-xs text-muted-foreground">Kỷ lục: {learningStats.longestStreak} ngày</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Tiến độ học tập</TabsTrigger>
              <TabsTrigger value="categories">Theo danh mục</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>
            <TabsContent value="progress" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ học tập theo tháng</CardTitle>
                  <CardDescription>Theo dõi sự tiến bộ của bạn qua các tháng</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ theo danh mục</CardTitle>
                  <CardDescription>Xem tiến độ của bạn trong từng danh mục học tập</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningStats.categoryProgress.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-sm text-muted-foreground">{category.progress}%</span>
                        </div>
                        <Progress value={category.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố thời gian học tập</CardTitle>
                    <CardDescription>Thời gian học tập theo thời điểm trong ngày</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                    <CardDescription>Các hoạt động học tập gần đây của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Hoàn thành bài học "Chào hỏi cơ bản"</p>
                          <p className="text-sm text-muted-foreground">2 giờ trước</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Đạt điểm 95/100 trong bài kiểm tra</p>
                          <p className="text-sm text-muted-foreground">Hôm qua</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Thực hành 30 phút ngôn ngữ ký hiệu</p>
                          <p className="text-sm text-muted-foreground">2 ngày trước</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

