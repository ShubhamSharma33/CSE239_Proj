import http from 'k6/http';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 0,
  stages: [
    { duration: '2s', target: 0 },   // idle
    { duration: '3s', target: 10 },  // spike to 10 users
    { duration: '15s', target: 10 }, // hold spike
    { duration: '2s', target: 0 },   // drop back
  ],
};

const API_URL ='http://llm-gpu-sshar134.nrp-nautilus.io/chat'
// 'http://llm-qwen-sshar134.nrp-nautilus.io/chat';

// Three simple coding prompts
const prompts = [
  "Write the definition of cloud computing ",
  "What’s 50 grams to milligrams ",
  "What’s 4+5"
];

export default function () {
  const prompt = randomItem(prompts);
    
  const payload = JSON.stringify({
    prompt: prompt,
    max_tokens: 50,  // Reduced from 60
  });
  
  http.post(API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '60s',  // Give GPU time to respond
  });
}