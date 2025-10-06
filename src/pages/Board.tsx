import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, MessageSquare, FileText } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  videoUrl?: string;
  aiNotes?: string;
  status: 'completed' | 'scheduled';
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
}

const Board = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    // TODO: Fetch from your QNAP API: GET /api/board/meetings
    setMeetings([
      {
        id: '1',
        title: 'Monthly Board Meeting - March 2025',
        date: '2025-03-10',
        status: 'completed',
        aiNotes: 'Key decisions: Approved new landscaping budget of $15,000. Discussed pool renovation timeline. Action items assigned to maintenance committee.'
      },
      {
        id: '2',
        title: 'Budget Planning Session',
        date: '2025-03-25',
        status: 'scheduled'
      }
    ]);

    // TODO: Fetch from your QNAP API: GET /api/board/discussions
    setDiscussions([
      {
        id: '1',
        title: 'New Security System Proposal',
        author: 'Board President',
        replies: 5,
        lastActivity: '2 hours ago'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Board Section</h1>
          <Badge variant="secondary">Board Members Only</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="meetings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="meetings">Meeting Notes</TabsTrigger>
            <TabsTrigger value="discussions">Discussion Board</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings" className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        {meeting.title}
                      </CardTitle>
                      <CardDescription>
                        {new Date(meeting.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={meeting.status === 'completed' ? 'default' : 'secondary'}>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                {meeting.aiNotes && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4" />
                        AI-Generated Notes
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {meeting.aiNotes}
                      </p>
                      {meeting.videoUrl && (
                        <Button variant="outline" size="sm" className="mt-2">
                          View Recording
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {discussion.title}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Started by {discussion.author}</span>
                    <span>{discussion.replies} replies • {discussion.lastActivity}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Board;
