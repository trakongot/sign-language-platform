import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MessageSquare, ThumbsUp, Share2, Search, Users, Video, Calendar } from "lucide-react"

export default function CommunityPage() {
  // Mock data for community posts
  const posts = [
    {
      id: 1,
      author: {
        name: "Trần Thị B",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Vừa hoàn thành bài học về chữ cái! Thật tuyệt vời khi có thể giao tiếp bằng ngôn ngữ ký hiệu. Ai đang học cùng tôi không?",
      image: "/placeholder.svg?height=300&width=600",
      likes: 24,
      comments: 8,
      time: "2 giờ trước",
    },
    {
      id: 2,
      author: {
        name: "Lê Văn C",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Chia sẻ một video hướng dẫn hữu ích về cách diễn đạt cảm xúc bằng ngôn ngữ ký hiệu. Hy vọng nó giúp ích cho mọi người!",
      video: "/placeholder.mp4",
      likes: 42,
      comments: 15,
      time: "1 ngày trước",
    },
    {
      id: 3,
      author: {
        name: "Phạm Thị D",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Tôi đang tìm bạn học cùng để thực hành ngôn ngữ ký hiệu hàng tuần qua video call. Ai quan tâm thì để lại bình luận nhé!",
      likes: 18,
      comments: 27,
      time: "3 ngày trước",
    },
  ]

  // Mock data for upcoming events
  const events = [
    {
      id: 1,
      title: "Hội thảo trực tuyến: Ngôn ngữ ký hiệu trong môi trường làm việc",
      date: "15 tháng 6, 2023",
      time: "19:00 - 20:30",
      attendees: 156,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 2,
      title: "Gặp gỡ cộng đồng: Thực hành ngôn ngữ ký hiệu",
      date: "22 tháng 6, 2023",
      time: "10:00 - 12:00",
      attendees: 89,
      image: "/placeholder.svg?height=150&width=300",
    },
  ]

  // Mock data for study groups
  const groups = [
    {
      id: 1,
      name: "Nhóm học ngôn ngữ ký hiệu cho người mới bắt đầu",
      members: 245,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Thực hành ngôn ngữ ký hiệu hàng ngày",
      members: 178,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Ngôn ngữ ký hiệu cho trẻ em",
      members: 132,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cộng đồng</h1>
            <p className="text-muted-foreground md:text-xl">
              Kết nối với những người học ngôn ngữ ký hiệu khác, chia sẻ kinh nghiệm và học hỏi cùng nhau
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <Input placeholder="Chia sẻ suy nghĩ của bạn..." className="flex-1" />
                  </div>
                </CardHeader>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <Button variant="outline">
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sự kiện
                  </Button>
                  <Button>Đăng</Button>
                </CardFooter>
              </Card>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{post.author.name}</CardTitle>
                          <CardDescription>{post.time}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{post.content}</p>
                      {post.image && (
                        <div className="rounded-md overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            width={600}
                            height={300}
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                      {post.video && (
                        <div className="rounded-md overflow-hidden bg-muted aspect-video flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Chia sẻ
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm trong cộng đồng..." className="pl-8" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện sắp tới</CardTitle>
                  <CardDescription>Tham gia các sự kiện cùng cộng đồng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                        <div className="flex items-center text-sm">
                          <Users className="mr-1 h-3 w-3" />
                          {event.attendees} người tham dự
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Xem tất cả sự kiện
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nhóm học tập</CardTitle>
                  <CardDescription>Tham gia các nhóm để học cùng nhau</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={group.image} alt={group.name} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium line-clamp-1">{group.name}</p>
                        <p className="text-sm text-muted-foreground">{group.members} thành viên</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Tham gia
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Xem tất cả nhóm
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

