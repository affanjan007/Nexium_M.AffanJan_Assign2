'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Globe, FileText, Sparkles, Zap, Shield, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface SummaryResult {
  success: boolean;
  originalUrl: string;
  title: string;
  englishSummary: string;
  urduSummary: string;
}

export default function Page() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/send-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error: ${res.status}`);
      }

      const data: SummaryResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize the blog. Please check the URL and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Using a more elegant notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.textContent = `${type} summary copied!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-black">AI-Powered Summarization</span>
          </div>
        
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog Summarizer
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform any blog post into concise summaries in both{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">English</span> and{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">Urdu</span> using advanced AI technology
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Dual Language</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600" />
                Enter Blog URL
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Paste any blog URL below to get instant AI-powered summaries
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/blog-post"
                    className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Summarize Blog
                      </>
                    )}
                  </Button>
                  
                  {(result || error) && (
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="px-6 h-12 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        {result && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Blog Information */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Blog Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">Title</Badge>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                    {result.title}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <Badge variant="secondary" className="mb-2">Source</Badge>
                  <a 
                    href={result.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="break-all">{result.originalUrl}</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* English Summary */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">EN</span>
                    </div>
                    English Summary
                  </CardTitle>
                  
                  <Button
                    onClick={() => copyToClipboard(result.englishSummary, 'English')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {result.englishSummary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Urdu Summary */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">اردو</span>
                    </div>
                    Urdu Summary | اردو خلاصہ
                  </CardTitle>
                  
                  <Button
                    onClick={() => copyToClipboard(result.urduSummary, 'Urdu')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-right font-urdu" dir="rtl">
                    {result.urduSummary}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Why Choose Our Blog Summarizer?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the power of AI-driven content summarization with our advanced features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get instant summaries in seconds with our optimized AI technology",
                color: "blue"
              },
              {
                icon: Globe,
                title: "Dual Language Support",
                description: "Perfect summaries in both English and Urdu for better accessibility",
                color: "green"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is processed securely with enterprise-grade protection",
                color: "purple"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r ${
                    feature.color === 'blue' ? 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' :
                    feature.color === 'green' ? 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' :
                    'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${
                      feature.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      feature.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Blog Summarizer</h3>
              <p className="text-gray-400">
                AI-powered content summarization made simple
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 Blog Summarizer. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Powered by advanced AI technology
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}