import { useState } from 'react';

interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string;
}

interface GeneratedMessage {
  original: string;
  enhanced?: string;
  row: Record<string, unknown>;
}

export function useMessageGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<GeneratedMessage[]>([]);
  const [progress, setProgress] = useState(0);

  const generate = async (
    template: string,
    personalizationFields: PersonalizationField[],
    data: Record<string, unknown>[],
    useAI: boolean = false
  ) => {
    setIsLoading(true);
    setError('');
    setMessages([]);
    setProgress(0);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          personalizationFields,
          data,
          useAI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate messages');
      }

      const result = await response.json();
      setMessages(result.messages);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    messages,
    progress,
    generate,
  };
}
