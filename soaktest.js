import http from 'k6/http';
import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 3,
  duration: '10m',
};

// Hard-coded API URL
const API_URL = "http://34.50.161.155/chat";

// Five prompts to avoid Redis cache
const prompts = [
  "state the 3 laws of physics",
  "What is the colour combination to make pink colour?",

  "Explain in simple terms what soak test is."
];

export default function () {
  const prompt = randomItem(prompts);

  const payload = JSON.stringify({
    prompt: prompt,
    max_tokens: 80
  });

  http.post(API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  sleep(0.5);
}
