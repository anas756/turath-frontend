import { useState } from 'react';

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      <path d="M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6L5 14z" />
    </svg>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ai-chatbot">
      {isOpen && (
        <section className="ai-chatbot-panel" aria-label="Turath AI assistant">
          <div className="ai-chatbot-header">
            <div>
              <span>Turath AI</span>
              <strong>Heritage Assistant</strong>
            </div>
            <button
              type="button"
              aria-label="Close AI assistant"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </div>

          <div className="ai-chatbot-body">
            <p>
              Ask me to find books, PDFs, videos, or collections about Moroccan
              heritage.
            </p>
          </div>

          <form className="ai-chatbot-form" onSubmit={(event) => event.preventDefault()}>
            <input type="text" placeholder="Ask about Moroccan culture..." />
            <button type="submit">Send</button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-chatbot-toggle"
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <SparkleIcon />
      </button>
    </div>
  );
}
