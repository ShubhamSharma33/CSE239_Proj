import http from 'k6/http';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '20s', target: 2 },   // ramp to 2 users
    { duration: '20s', target: 5 },   // to 5 users
    { duration: '20s', target: 8 },   // to 8 users
    { duration: '20s', target: 12 },  // push to 12 users
    { duration: '20s', target: 0 },   // cooldown
  ],
};

const API_URL = 'http://llm-gpu-sshar134.nrp-nautilus.io/chat'
//'http://llm-qwen-sshar134.nrp-nautilus.io/chat';

// Three simple coding prompts
const prompts = [
  "Write a Python function to add two numbers",
  "Create a function to reverse a string",
  "Write code to check if a number is even"
];

export default function () {
  const prompt = randomItem(prompts);
  
  const payload = JSON.stringify({
    prompt: prompt,
    max_tokens: 50,
  });
  
  http.post(API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '60s',
  });
}