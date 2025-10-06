import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, FolderLock, Bell, LogOut } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
}

const Home = () => {
  const { user, logout } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // TODO: Fetch news from your QNAP API: GET /api/news
    // const fetchNews = async () => {
    //   const response = await fetch('YOUR_QNAP_API/api/news', {
    //     headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    //   });
    //   const data = await response.json();
    //   setNews(data);
    // };
    // fetchNews();

    // Mock data
    setNews([
      {
        id: '1',
        title: 'Pool Maintenance Schedule',
        content: 'The pool will be closed for maintenance on Friday, March 15th from 9am-2pm.',
        author: 'Admin',
        date: new Date().toISOString(),
        priority: 'important'
      },
      {
        id: '2',
        title: 'Community BBQ Event',
        content: 'Join us for our annual spring BBQ on Saturday, March 23rd at 5pm by the clubhouse.',
        author: 'Events Committee',
        date: new Date().toISOString(),
        priority: 'normal'
      }
    ]);
  }, []);

  const priorityColors = {
    normal: 'bg-secondary text-secondary-foreground',
    important: 'bg-primary text-primary-foreground',
    urgent: 'bg-destructive text-destructive-foreground'
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Holiday Community Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link to="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Rooms
                </CardTitle>
                <CardDescription>Join community discussions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {(user?.role === 'board' || user?.role === 'admin') && (
            <Link to="/board">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Board Section
                  </CardTitle>
                  <CardDescription>Meeting notes & discussions</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderLock className="h-5 w-5" />
                    Admin Section
                  </CardTitle>
                  <CardDescription>Legal & financial documents</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Community Bulletin Board</h2>
          </div>

          {news.map((item) => (
            <Card key={item.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      Posted by {item.author} • {new Date(item.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={priorityColors[item.priority]}>
                    {item.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
