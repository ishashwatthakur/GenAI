'use client';

import { useEffect, useState, useRef, FormEvent, ChangeEvent } from 'react';
import type { AnalysisResult } from '@/types/analysis';
import type { SpeechRecognition } from '@/types/speech'; 
import './Chatbot.css';

// --- TYPE DEFINITIONS ---
interface ConversationMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface Message {
  content: string;
  isUser: boolean;
}


export default function ChatBot(): JSX.Element {
  // --- STATE WITH TYPES ---
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasCheckedMainDoc, setHasCheckedMainDoc] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // --- REFS WITH TYPES ---
  const currentlySpeakingRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isProcessingFileRef = useRef<boolean>(false);
  const documentAnalysisRef = useRef<AnalysisResult | null>(null);
  const conversationHistoryRef = useRef<ConversationMessage[]>([]);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);

  // DOM Element Refs
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const voiceInputBtnRef = useRef<HTMLButtonElement>(null);

  // API Configuration
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_CHATBOT_API_KEY || '';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // --- EFFECT: Initial Welcome Message ---
  useEffect(() => {
    console.log('Chatbot component mounted');

    setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 6000);

    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.welcome-popup') && !target.closest('#chatbot-toggler')) {
        setShowWelcome(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      clearTimeout(welcomeTimer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // --- EFFECT: Check for Main Page Document ---
  useEffect(() => {
    const checkForMainPageDocument = (): void => {
      if (document.body.classList.contains('show-chatbot') && !hasCheckedMainDoc) {
        const mainPageDocument = sessionStorage.getItem('uploadedDocument');
        if (mainPageDocument) {
          const docData = JSON.parse(mainPageDocument);

          setTimeout(() => {
            setMessages(prev => {
              const alreadyExists = prev.some(m => m.content.includes('I noticed you uploaded'));
              if (!alreadyExists) {
                return [...prev, {
                  content: `📄 I noticed you uploaded <strong>"${docData.fileName}"</strong> on the main page. <br>Please re-upload the same document here using the 📎 paperclip icon for me to analyze it and answer your questions.`,
                  isUser: false
                }];
              }
              return prev;
            });
          }, 500);

          setHasCheckedMainDoc(true);
        }
      }
    };

    const observer = new MutationObserver(() => {
      checkForMainPageDocument();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    checkForMainPageDocument();

    return () => {
      observer.disconnect();
    };
  }, [hasCheckedMainDoc]);

  // --- EFFECT: Speech Recognition Setup ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (messageInputRef.current) {
          messageInputRef.current.value = transcript;
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        isRecordingRef.current = false;
        voiceInputBtnRef.current?.classList.remove('recording');
      };

      recognitionRef.current.onend = () => {
        isRecordingRef.current = false;
        voiceInputBtnRef.current?.classList.remove('recording');
      };
    }
  }, []);

  // --- EFFECT: Auto-scroll to bottom when messages change ---
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ 
        top: chatBodyRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  }, [messages, isThinking]);

  // --- EFFECT: Sync documentAnalysis with ref ---
  useEffect(() => {
    documentAnalysisRef.current = documentAnalysis;
  }, [documentAnalysis]);

  // --- Document Analysis Function ---
  const analyzeDocument = async (file: File): Promise<AnalysisResult> => {
    try {
      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/document-process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        setDocumentAnalysis(data.analysis);
        documentAnalysisRef.current = data.analysis;
        return data.analysis;
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Handle Send Message ---
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!messageInputRef.current?.value.trim()) return;

    const userMessage = messageInputRef.current.value.trim();

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    if (currentlySpeakingRef.current) {
      currentlySpeakingRef.current.classList.remove('speaking');
      currentlySpeakingRef.current = null;
    }

    // Add user message
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    messageInputRef.current.value = '';

    // Add to conversation history
    conversationHistoryRef.current.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // Show thinking state
    setIsThinking(true);

    try {
      const requestMessages: ConversationMessage[] = [];

      // Add document context if available
      if (documentAnalysisRef.current) {
        const analysis = documentAnalysisRef.current;
        requestMessages.push({
          role: "user",
          parts: [{
            text: `SYSTEM CONTEXT: You are analyzing this document:
Document Name: ${analysis.metadata?.fileName || 'Uploaded Document'}
Document Type: ${analysis.documentType}
Summary: ${analysis.summary}
Risk Level: ${analysis.riskLevel} (Score: ${analysis.overallRiskScore}/100)

Key Information:
- Parties: ${analysis.parties?.join(', ') || 'Not specified'}
- Effective Date: ${analysis.effectiveDate}
- Expiration Date: ${analysis.expirationDate}
- Main Concerns: ${analysis.finalVerdict?.mainConcerns?.join(', ') || 'None'}
- Recommendation: ${analysis.finalVerdict?.recommendation}

Flagged Clauses:
${analysis.flaggedClauses?.map(clause =>
              `- ${clause.title} (${clause.severity}): ${clause.description}`
            ).join('\n') || 'No concerning clauses found'}

Document Text Extract:
${analysis.metadata?.documentText?.substring(0, 3000) || 'No text available'}

Remember this context for all following questions.`
          }]
        });
      }

      // Add conversation history
      conversationHistoryRef.current.forEach(msg => {
        requestMessages.push(msg);
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: requestMessages
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "API Error");

      let apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response. Please try again.";

      // Format response
      apiResponseText = apiResponseText
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

      // Add bot response
      setMessages(prev => [...prev, { content: apiResponseText, isUser: false }]);

      // Add to conversation history
      conversationHistoryRef.current.push({
        role: "model",
        parts: [{ text: apiResponseText }]
      });

      // Limit conversation history
      if (conversationHistoryRef.current.length > 20) {
        conversationHistoryRef.current = conversationHistoryRef.current.slice(-20);
      }

    } catch (error) {
      console.error("Bot error:", error);
      setMessages(prev => [...prev, {
        content: "Sorry, I encountered an error. Please try again or check your internet connection.",
        isUser: false
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // --- Handle File Upload ---
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isProcessingFileRef.current) return;

    isProcessingFileRef.current = true;

    try {
      setUploadedDocument(file);
      conversationHistoryRef.current = [];

      setMessages(prev => [...prev, {
        content: `📤 Uploading "${file.name}"...`,
        isUser: false
      }]);

      const analysis = await analyzeDocument(file);

      // Remove uploading message and add success
      setMessages(prev => {
        const filtered = prev.filter(m => !m.content.includes('Uploading'));
        return [...filtered, {
          content: `✅ Document "${file.name}" analyzed successfully!<br><br>
📊 <strong>Analysis Summary:</strong><br>
- <strong>Document Type:</strong> ${analysis.documentType}<br>
- <strong>Risk Level:</strong> ${analysis.riskLevel} (${analysis.overallRiskScore}/100)<br>
- <strong>Key Parties:</strong> ${analysis.parties?.join(', ') || 'Not specified'}<br>
- <strong>Main Concerns:</strong> ${analysis.finalVerdict?.mainConcerns?.length || 0} issues found<br>
- <strong>Recommendation:</strong> ${analysis.finalVerdict?.recommendation}<br><br>
You can now ask me any questions about this document!`,
          isUser: false
        }];
      });

      sessionStorage.removeItem('uploadedDocument');

    } catch (error: any) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.content.includes('Uploading'));
        return [...filtered, {
          content: `❌ Sorry, I couldn't analyze the document "${file.name}". ${error.message || 'Please try again.'}`,
          isUser: false
        }];
      });

      setUploadedDocument(null);
      setDocumentAnalysis(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      isProcessingFileRef.current = false;
    }
  };

  // --- Handle Voice Input ---
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecordingRef.current) {
      recognitionRef.current.stop();
      isRecordingRef.current = false;
      voiceInputBtnRef.current?.classList.remove('recording');
    } else {
      recognitionRef.current.start();
      isRecordingRef.current = true;
      voiceInputBtnRef.current?.classList.add('recording');
    }
  };

  // --- Handle Clear Chat ---
  const handleClearChat = () => {
    conversationHistoryRef.current = [];
    setMessages([]);
  };

  // --- Handle Close Chatbot ---
  const handleCloseChatbot = () => {
    document.body.classList.remove("show-chatbot");
    window.speechSynthesis.cancel();
    if (currentlySpeakingRef.current) {
      currentlySpeakingRef.current.classList.remove('speaking');
      currentlySpeakingRef.current = null;
    }
  };

  // --- Handle Toggle Chatbot ---
  const handleToggleChatbot = () => {
    document.body.classList.toggle("show-chatbot");
    setShowWelcome(false);
  };

  // --- Handle File Upload Button Click ---
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Welcome Popup */}
      <div className={`welcome-popup ${showWelcome ? 'show' : ''}`}>
        <p>Hi! 👋 I can help you analyze your legal documents. Click here to start.</p>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        id="chatbot-toggler"
        onClick={handleToggleChatbot}
        aria-label="Toggle chatbot"
      >
        <span className="material-symbols-outlined">mode_comment</span>
                <span className="material-symbols-outlined">close</span>
      </button>

      {/* Chatbot Popup */}
      <div className="chatbot-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <svg className="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <h2 className="logo-text">Ask Lexi</h2>
          </div>
          <button
            type="button"
            id="clear-chat"
            title="Clear chat history"
            onClick={handleClearChat}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <button
            type="button"
            id="close-chatbot"
            onClick={handleCloseChatbot}
            aria-label="Close chatbot"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Document Status Indicator */}
        {uploadedDocument && (
          <div className="document-status">
            <span className="material-symbols-outlined">description</span>
            <span>{uploadedDocument.name}</span>
            {isAnalyzing && <span className="analyzing-indicator"> (Analyzing...)</span>}
          </div>
        )}

        {/* Chat Body */}
        <div className="chat-body" ref={chatBodyRef}>
          {/* Initial Welcome Message */}
          <div className="message bot-message">
            <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <div className="message-text">
              Hello! I'm your Lexi Assistant. I can help you analyze legal documents and answer questions about them.
              <br /><br />
              📎 Upload a document using the paperclip icon below to get started!
            </div>
          </div>

          {/* Dynamic messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
              {!msg.isUser && (
                <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
              )}
              <div
                className="message-text"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="message bot-message thinking">
              <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
              </svg>
              <div className="message-text">
                <div className="thinking-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <form className="chat-form" onSubmit={handleSendMessage}>
            <textarea
              ref={messageInputRef}
              className="message-input"
              placeholder={documentAnalysis ? "Ask me anything about your document..." : "Upload a document first to start chatting..."}
              required
            ></textarea>
            <div className="chat-controls">
              <div className="file-upload-wrapper">
                <button
                  type="button"
                  id="file-upload"
                  onClick={handleFileUploadClick}
                  aria-label="Upload file"
                >
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  type="file"
                  id="file-input"
                  ref={fileInputRef}
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  hidden
                />
              </div>
              <button
                type="button"
                id="voice-input"
                ref={voiceInputBtnRef}
                onClick={handleVoiceInput}
                aria-label="Voice input"
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                type="submit"
                id="send-message"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}