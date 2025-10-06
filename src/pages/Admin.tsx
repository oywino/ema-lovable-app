import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, FileText, Download, Upload } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: 'legal' | 'financial';
  date: string;
  size: string;
  url: string;
}

const Admin = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchQuery, setAiSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch from your QNAP API: GET /api/admin/documents
    setDocuments([
      {
        id: '1',
        name: 'Annual Budget 2025',
        category: 'financial',
        date: '2025-01-15',
        size: '2.4 MB',
        url: '#'
      },
      {
        id: '2',
        name: 'HOA Bylaws Amendment',
        category: 'legal',
        date: '2024-12-10',
        size: '1.2 MB',
        url: '#'
      },
      {
        id: '3',
        name: 'Insurance Policy 2025',
        category: 'legal',
        date: '2025-01-01',
        size: '3.1 MB',
        url: '#'
      }
    ]);
  }, []);

  const handleAISearch = async () => {
    // TODO: Call your QNAP API with AI search: POST /api/admin/ai-search
    // const response = await fetch('YOUR_QNAP_API/api/admin/ai-search', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query: aiSearchQuery })
    // });
    console.log('AI Search:', aiSearchQuery);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors = {
    legal: 'bg-blue-500/10 text-blue-500',
    financial: 'bg-green-500/10 text-green-500'
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Admin Section</h1>
          <Badge variant="destructive">Admin Only</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Document Search</CardTitle>
              <CardDescription>
                Ask questions about your documents using natural language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., What was our insurance premium last year?"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                />
                <Button onClick={handleAISearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 mt-1" />
                      <div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <CardDescription>
                          {new Date(doc.date).toLocaleDateString()} • {doc.size}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={categoryColors[doc.category]}>
                      {doc.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
