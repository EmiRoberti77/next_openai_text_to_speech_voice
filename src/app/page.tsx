'use client';
import { useState } from 'react';
import fetch from 'isomorphic-fetch';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const endpoint = 'https://api.openai.com/v1/audio/speech';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
};

const voice = {
  alloy: 'alloy',
  echo: 'echo',
  fable: 'fable',
  onyx: 'onyx',
  nova: 'nova',
  shimmer: 'shimmer',
};

export default function Home() {
  console.log(apiKey);
  const [input, setInput] = useState('');

  const createSpeech = async () => {
    const body = {
      model: 'tts-1',
      input,
      voice: voice.echo,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('failed to fetch audio');
    }

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioData = await response.arrayBuffer();
    const decodedAudioData = await audioContext.decodeAudioData(audioData);

    const source = audioContext.createBufferSource();
    source.buffer = decodedAudioData;
    source.connect(audioContext.destination);
    source.start(0);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <input type="text" onChange={(e) => setInput(e.target.value)} />
        <button onClick={createSpeech}>create speech</button>
      </div>
    </main>
  );
}
