# AI-Powered Personal Portfolio Assistant

An interactive personal portfolio with a locally hosted AI assistant that answers questions about my skills, education, experience, and projects.

Instead of only browsing through a traditional portfolio or resume, visitors can directly ask questions such as:

- What are Jason's strongest skills?
- Does Jason have AWS experience?
- Tell me about Jason's AI projects.
- Where did Jason intern?
- Where did Jason study?

The assistant generates concise responses grounded in structured resume data and provides source navigation so visitors can quickly jump to the relevant section or project.

---

## Features

- Interactive AI assistant embedded directly in the portfolio
- Local LLM inference using Ollama and Qwen3:4B
- FastAPI backend for LLM communication and resume context selection
- Structured resume data for grounded AI responses
- Context-based routing to reduce unnecessary prompt information
- Source-aware responses linked to relevant portfolio sections
- Smooth navigation from AI responses to supporting portfolio content
- Suggested questions for recruiters and visitors
- Responsive portfolio interface built with Next.js
- Environment-based backend and CORS configuration
- Local and LAN deployment support
- No external LLM API required for the current AI inference pipeline

---

## Architecture

```text
                  User / Recruiter
                        |
                        v
              +-------------------+
              | Next.js Portfolio |
              +-------------------+
                        |
                        v
              +-------------------+
              |  AI Chat Interface|
              +-------------------+
                        |
                        v
              +-------------------+
              | FastAPI Backend   |
              +-------------------+
                   |          |
                   |          |
                   v          v
          +-------------+   +------------------+
          | resume.json |   | Context Routing  |
          +-------------+   +------------------+
                   \          /
                    \        /
                     v      v
                  +----------+
                  |  Ollama  |
                  +----------+
                        |
                        v
                  +-----------+
                  | Qwen3:4B  |
                  +-----------+
                        |
                        v
             Grounded Answer + Source
```

The frontend sends a user's question to the FastAPI backend.

The backend selects relevant resume information, constructs a grounded prompt, and sends it to the locally hosted Qwen3:4B model through Ollama.

The generated response is returned together with source metadata, allowing the frontend to navigate users directly to the relevant portfolio section.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Python
- FastAPI
- HTTPX

### AI

- Ollama
- Qwen3:4B
- Local LLM inference
- Structured resume grounding
- Context-based retrieval

### Development & Deployment

- Git
- GitHub
- Node.js / npm
- Python virtual environments
- Environment-based configuration
- Local network deployment

---

## Project Structure

```text
jason-portfolio/
├── app/
│   └── page.tsx
│
├── components/
│   └── AIChat.tsx
│
├── backend/
│   ├── data/
│   │   └── resume.json
│   ├── main.py
│   └── requirements.txt
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Key Components

**`app/page.tsx`**

Main portfolio interface containing education, technical skills, experience, projects, and contact information.

**`components/AIChat.tsx`**

Interactive AI chat interface responsible for sending questions to the backend, displaying responses, showing suggested questions, and navigating users to supporting portfolio content.

**`backend/main.py`**

FastAPI backend responsible for processing questions, selecting relevant resume context, communicating with Ollama, and returning grounded responses with source metadata.

**`backend/data/resume.json`**

Structured resume information used as the grounding source for the AI assistant.

---

# Getting Started

## Prerequisites

Before running the project, make sure the following are installed:

- Node.js
- npm
- Python 3
- Git
- Ollama

---

## 1. Clone the Repository

```bash
git clone https://github.com/Jason980102/jason-portfolio.git
cd jason-portfolio
```

---

## 2. Install Frontend Dependencies

```bash
npm install
```

---

## 3. Create a Python Virtual Environment

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 4. Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

---

## 5. Install and Configure Ollama

Install Ollama on the host machine.

Then download the model used by the project:

```bash
ollama pull qwen3:4b
```

Verify that the model is installed:

```bash
ollama list
```

You should see:

```text
qwen3:4b
```

You can also test the model directly:

```bash
ollama run qwen3:4b
```

---

## 6. Configure Environment Variables

Create a `.env` file in the project root.

You can use `.env.example` as a template.

Example local configuration:

```env
OLLAMA_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=qwen3:4b

NEXT_PUBLIC_API_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Environment Variables

| Variable | Description |
| --- | --- |
| `OLLAMA_URL` | Ollama Chat API endpoint |
| `OLLAMA_MODEL` | Local model used by the assistant |
| `NEXT_PUBLIC_API_URL` | FastAPI backend address used by the frontend |
| `CORS_ORIGINS` | Frontend origins allowed to communicate with FastAPI |

The `.env` file contains machine-specific configuration and should not be committed to GitHub.

Only `.env.example` should be tracked.

---

# Running the Application

The application consists of three components:

```text
Next.js Frontend
        |
        v
FastAPI Backend
        |
        v
Ollama / Qwen3:4B
```

Ollama must be available before AI requests can be processed.

---

## 1. Start the FastAPI Backend

Activate the Python virtual environment if necessary:

```powershell
.\.venv\Scripts\Activate.ps1
```

Then run:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:

```text
http://localhost:8000
```

Check the health endpoint:

```text
http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

FastAPI documentation is also available at:

```text
http://localhost:8000/docs
```

---

## 2. Start the Next.js Frontend

Open another terminal in the project directory:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The portfolio and AI assistant should now be available.

---

# LAN Deployment

The application can also be accessed by other devices on the same local network.

This is useful when the portfolio is hosted on a dedicated computer.

## Start FastAPI for LAN Access

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Start Next.js for LAN Access

```bash
npm run dev -- --hostname 0.0.0.0 --port 3001
```

---

## Configure the Host Machine

Find the LAN IP address of the computer running the application.

For example:

```text
192.168.1.100
```

Update the machine's `.env`:

```env
OLLAMA_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=qwen3:4b

NEXT_PUBLIC_API_URL=http://192.168.1.100:8000

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://192.168.1.100:3001
```

Then another device on the same network can access:

```text
http://192.168.1.100:3001
```

Replace `192.168.1.100` with the actual IP address of the host machine.

---

# How the AI Assistant Works

When a visitor submits a question, the application follows this pipeline:

```text
1. User submits a question
          |
          v
2. Next.js sends the question to FastAPI
          |
          v
3. Backend identifies relevant resume context
          |
          v
4. Relevant structured data is selected
          |
          v
5. A grounded prompt is constructed
          |
          v
6. Prompt is sent to Qwen3:4B through Ollama
          |
          v
7. Model generates a concise response
          |
          v
8. Backend attaches source metadata
          |
          v
9. Frontend displays answer + source navigation
```

The model is instructed to answer using only the relevant portfolio information provided by the backend.

This helps reduce unsupported claims and keeps responses focused on information contained in the portfolio.

---

# Context Routing

The current MVP uses lightweight context-based routing.

Instead of sending the entire resume to the model for every question, the backend selects information relevant to the user's request.

For example:

```text
"Where did Jason study?"
        ↓
Education Context
```

```text
"Does Jason have AWS experience?"
        ↓
Cloud / DevOps Context
        ↓
Relevant Project Information
```

```text
"Tell me about Jason's AI projects"
        ↓
AI / ML Context
        ↓
Relevant Projects
```

This approach reduces unnecessary prompt context while keeping the current architecture simple.

It is intentionally used as the MVP retrieval strategy before introducing semantic retrieval and Retrieval-Augmented Generation (RAG).

---

# Source-Aware Responses

AI responses can include metadata identifying the portfolio section that supports the answer.

For example:

```text
Question:
Does Jason have AWS experience?

Answer:
Yes. Jason has experience with AWS EC2 and AWS S3,
demonstrated through his Cloud-Based Intelligent
Taekwondo Motion Classification System.

Source:
Cloud-Based Intelligent Taekwondo Motion Classification System
```

Selecting **View source** navigates the visitor directly to the relevant section or project card in the portfolio.

This allows recruiters to quickly verify information provided by the AI assistant.

---

# Example Questions

Visitors can ask questions such as:

```text
What are Jason's strongest skills?
```

```text
Does Jason have AWS experience?
```

```text
Tell me about Jason's AI projects.
```

```text
Does Jason have CNN experience?
```

```text
Where did Jason intern?
```

```text
Where did Jason study?
```

The assistant is designed to provide short, recruiter-friendly answers rather than long conversational responses.

---

# Design Goals

The project is designed around several principles:

### Grounded Responses

The assistant should answer based on portfolio and resume information rather than inventing unsupported experience.

### Concise Answers

Responses are intentionally short so recruiters can quickly understand relevant qualifications.

### Evidence Navigation

Answers can direct visitors to the portfolio section containing supporting information.

### Local AI

The LLM runs locally through Ollama rather than requiring an external LLM API for the current inference pipeline.

### Portable Configuration

Machine-specific addresses and deployment settings are stored in environment variables rather than hard-coded into the application.

### Incremental AI Architecture

The system starts with a simple context-routing MVP and is designed to evolve toward semantic retrieval, RAG, and agent-based functionality.

---

# Current Status

### Completed

- [x] Personal portfolio interface
- [x] Responsive Next.js frontend
- [x] Interactive AI chat interface
- [x] FastAPI backend
- [x] Structured resume data
- [x] Local Ollama integration
- [x] Qwen3:4B integration
- [x] Context-based resume retrieval
- [x] Grounded AI responses
- [x] Concise response formatting
- [x] Suggested recruiter questions
- [x] Source metadata
- [x] View Source navigation
- [x] Project-specific section IDs
- [x] Environment-based API configuration
- [x] Environment-based CORS configuration
- [x] Local network access
- [x] GitHub MVP checkpoint

---

# Roadmap

The current system is an MVP and will be expanded incrementally.

## Phase 1 — AI Portfolio MVP

- [x] Portfolio interface
- [x] AI chat
- [x] Structured resume grounding
- [x] Local LLM inference
- [x] Context routing
- [x] Source-aware responses
- [x] Source navigation

## Phase 2 — Semantic Retrieval / RAG

- [ ] Resume and project chunking
- [ ] Embedding generation
- [ ] Semantic similarity search
- [ ] Vector storage
- [ ] Retrieval-Augmented Generation (RAG)
- [ ] Retrieval metadata-based source attribution
- [ ] Improved handling of paraphrased recruiter questions

## Phase 3 — AI Agent Capabilities

- [ ] Tool-based portfolio actions
- [ ] Project-specific information retrieval
- [ ] GitHub project integration
- [ ] Agent-based query routing
- [ ] Additional recruiter-focused tools

## Phase 4 — Deployment

- [ ] Dedicated server deployment
- [ ] Production frontend configuration
- [ ] Production backend configuration
- [ ] Persistent AI service
- [ ] Public access configuration

---

# Why Local LLM?

The current implementation uses a locally hosted model for several reasons:

- No external LLM API is required for inference
- Resume context can remain on the host machine
- No per-request API cost
- Greater control over model configuration
- Useful environment for experimenting with LLM application architecture
- Provides a foundation for future RAG and agent functionality

Qwen3:4B was selected as a lightweight model suitable for running locally while still supporting portfolio question answering.

---

# Limitations

The current version uses rule-based context routing rather than semantic retrieval.

As a result, some differently phrased or ambiguous questions may not always retrieve the most specific supporting project.

The current source-selection mechanism is therefore part of the MVP and will be replaced or enhanced by semantic retrieval in a future RAG implementation.

The assistant is also intentionally restricted to information contained in the portfolio data and should not infer unsupported skills, employment, education, or project experience.

---

# Future RAG Architecture

A future version of the project is planned to replace most manual context routing with semantic retrieval.

The target architecture is:

```text
User Question
      |
      v
Embedding Model
      |
      v
Semantic Search
      |
      v
Vector Store
      |
      v
Relevant Resume / Project Chunks
      |
      v
Qwen3:4B
      |
      v
Grounded Answer
      +
Retrieved Source Metadata
```

Each resume or project chunk will contain metadata such as:

```json
{
  "label": "Human Activity Recognition Using CNN",
  "section": "human-activity-recognition",
  "type": "project"
}
```

This will allow the same retrieved evidence to be used both for generating the answer and identifying the supporting source.

---

# Security and Privacy

The current AI inference pipeline runs locally through Ollama.

The application does not require an external LLM API to generate portfolio answers.

Environment-specific configuration is stored in `.env`, which is excluded from version control.

The repository contains `.env.example` only as a configuration template.

Never commit credentials, private API keys, or sensitive environment variables to the repository.

---

# Author

**Jason Chen**

M.S. in Computer Science  
New York University — Courant Institute of Mathematical Sciences

B.S. in Computer Science  
University of Taipei

### Areas of Interest

- Software Engineering
- Data Engineering
- Artificial Intelligence / Machine Learning
- Cloud Computing
- DevOps
- AI Systems

### Links

- GitHub: https://github.com/Jason980102
- LinkedIn: https://www.linkedin.com/in/jason-chen-030669381/

---

## Project Status

**Current Version:** AI Portfolio Assistant MVP

The current milestone provides a working end-to-end pipeline:

```text
Next.js
   ↓
FastAPI
   ↓
Resume Context
   ↓
Ollama
   ↓
Qwen3:4B
   ↓
Grounded Response + Source Navigation
```

The next major development milestone is **semantic retrieval and Retrieval-Augmented Generation (RAG)** after completing the baseline deployment workflow.