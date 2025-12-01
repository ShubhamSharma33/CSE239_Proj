FROM python:3.11-slim
RUN apt-get update && apt-get install -y build-essential curl wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY src/ ./src/
COPY frontend/ ./frontend/
RUN mkdir -p models
RUN wget -q https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf -O /app/models/llama-3.2-3b-q4.gguf
EXPOSE 8080
WORKDIR /app/src
CMD ["gunicorn", "-w", "8", "-b", "0.0.0.0:8080", "--timeout", "300", "app:app"]
