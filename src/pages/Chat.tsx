import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  unread: number;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Fetch chat rooms from your QNAP API: GET /api/chat/rooms
    setRooms([
      { id: '1', name: 'General Discussion', description: 'Community chat', unread: 3 },
      { id: '2', name: 'Maintenance Requests', description: 'Report issues', unread: 0 },
      { id: '3', name: 'Events & Activities', description: 'Plan together', unread: 1 }
    ]);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      // TODO: Fetch messages from your QNAP API: GET /api/chat/rooms/:roomId/messages
      setMessages([
        {
          id: '1',
          userId: '2',
          userName: 'Jane Smith',
          content: 'Has anyone seen the new pool schedule?',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          userId: user?.id || '1',
          userName: user?.name || 'You',
          content: 'Yes, it was posted on the bulletin board.',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [selectedRoom, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    // TODO: Send message to your QNAP API: POST /api/chat/rooms/:roomId/messages
    const message: Message = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.name || 'You',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chat Rooms</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <div className="grid md:grid-cols-[300px_1fr] gap-4 h-full">
          <Card>
            <CardHeader>
              <CardTitle>Rooms</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedRoom === room.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs opacity-80">{room.description}</p>
                      </div>
                      {room.unread > 0 && (
                        <Badge variant="secondary">{room.unread}</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedRoom ? (
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{rooms.find(r => r.id === selectedRoom)?.name}</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.userId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-xs font-medium mb-1">{msg.userName}</p>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center">
              <p className="text-muted-foreground">Select a room to start chatting</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
