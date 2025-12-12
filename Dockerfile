FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

# Install Python and build tools (including ninja)
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    build-essential \
    wget \
    git \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .

# Install llama-cpp-python with CUDA support
RUN CMAKE_ARGS="-DGGML_CUDA=on" pip install llama-cpp-python --no-cache-dir
RUN pip install --no-cache-dir flask flask-cors gunicorn

COPY src/ ./src/
COPY frontend/ ./frontend/
RUN mkdir -p models
RUN wget -q https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf -O /app/models/llama-3.2-3b-q4.gguf

EXPOSE 8080
WORKDIR /app/src
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8080", "--timeout", "300", "app:app"]