import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Calendar, Clock, Edit, Settings, Trophy } from "lucide-react"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    level: "Intermediate",
    joinDate: "January 2023",
    progress: 65,
    streak: 28,
    badges: [
      { id: 1, name: "7 Day Streak", icon: Calendar },
      { id: 2, name: "Alphabet Master", icon: BookOpen },
      { id: 3, name: "Quick Learner", icon: Clock },
    ],
    completedLessons: 24,
    totalLessons: 50,
    achievements: [
      { id: 1, name: "Completed Alphabet Basics", date: "Feb 15, 2023" },
      { id: 2, name: "Mastered Common Greetings", date: "Mar 10, 2023" },
      { id: 3, name: "Completed 20 Practice Sessions", date: "Apr 5, 2023" },
    ],
    recentActivity: [
      { id: 1, action: "Completed lesson", name: "Numbers & Counting", date: "2 days ago" },
      { id: 2, action: "Practiced", name: "Common Greetings", date: "3 days ago" },
      { id: 3, action: "Translated video", date: "1 week ago" },
    ],
  }

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{user.level}</Badge>
                <Badge variant="outline">Joined {user.joinDate}</Badge>
              </div>
            </div>
            <div className="md:ml-auto flex gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your overall learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold">{user.progress}%</span>
                      <span className="text-sm text-muted-foreground">Overall progress</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-bold">{user.completedLessons}</span>
                      <span className="text-sm text-muted-foreground">of {user.totalLessons} lessons</span>
                    </div>
                  </div>
                  <Progress value={user.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Current Streak</CardTitle>
                <CardDescription>Keep practicing to maintain your streak</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{user.streak} days</div>
                    <p className="text-sm text-muted-foreground">Your current learning streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Badges Earned</CardTitle>
                <CardDescription>Achievements you've unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge) => {
                    const BadgeIcon = badge.icon
                    return (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center justify-center p-2 border rounded-md w-[80px]"
                      >
                        <BadgeIcon className="h-8 w-8 text-primary mb-1" />
                        <span className="text-xs text-center">{badge.name}</span>
                      </div>
                    )
                  })}
                  <div className="flex flex-col items-center justify-center p-2 border rounded-md border-dashed w-[80px]">
                    <Trophy className="h-8 w-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-center text-muted-foreground">More to earn</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">
                            {activity.action} {activity.name && <span className="font-bold">{activity.name}</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Milestones you've reached in your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

