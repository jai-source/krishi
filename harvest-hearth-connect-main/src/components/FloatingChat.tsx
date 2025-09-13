import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      // Process user message
      console.log('User message:', message);
      setMessage('');
      // Here you would integrate with a chat service
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        className="floating-chat"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        variant="hero"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card 
          ref={chatRef}
          className="fixed bottom-20 right-6 w-80 h-96 shadow-xl z-50 animate-fade-in"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                KrishiSettu Assistant
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-3 p-3 bg-muted/30 rounded-md">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">👋 Hello! I'm your KrishiSettu assistant.</p>
                <p>How can I help you today?</p>
                <ul className="mt-3 space-y-1 text-xs">
                  <li>• Find auction information</li>
                  <li>• Registration help</li>
                  <li>• Platform guidance</li>
                  <li>• Technical support</li>
                </ul>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};