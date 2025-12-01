import http from 'k6/http';
import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 0,
  stages: [
    { duration: '1s', target: 0 },  
    { duration: '1s', target: 25 },  // Spike to 25 users instantly
    { duration: '20s', target: 25 }, // Hold at peak load
    { duration: '1s', target: 0 },   // Drop back to 0
  ],

  thresholds: {
    // Require p(95) latency < 5s
    http_req_duration: ['p(95)<25000'],
    // Require <5% failures
    http_req_failed: ['rate<0.05'],
  },
};

// Your API endpoint
const API_URL = "http://34.50.161.155/chat";

// Prompts to avoid caching
const prompts = [
  "Explain cloud computing in simple words.",
  "What is virtualization in cloud systems?",
  "Explain Kubernetes to a beginner.",
  "What is the purpose of Docker containers?",
  "Explain load balancing in distributed systems."
];

export default function () {
  const prompt = randomItem(prompts);

  const payload = JSON.stringify({
    prompt: prompt,
    max_tokens: 80
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(API_URL, payload, { headers });

  // Simple result logging — not too spammy
  if (res.status !== 200) {
    console.error(`❌ Request failed: ${res.status} - ${res.body}`);
  }
  
  sleep(0.2); // helps stabilize VU pacing
}
