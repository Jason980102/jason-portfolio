import json
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# Environment Variables
# =========================================================

load_dotenv()


# =========================================================
# FastAPI App
# =========================================================

app = FastAPI(title="Jason Portfolio AI Backend")


# =========================================================
# CORS
# =========================================================

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in cors_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Paths
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
RESUME_PATH = BASE_DIR / "data" / "resume.json"


# =========================================================
# Ollama Configuration
# =========================================================

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434/api/chat",
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen3:4b",
)


# =========================================================
# Request Model
# =========================================================

class ChatRequest(BaseModel):
    message: str


# =========================================================
# Relevant Context Router
# =========================================================

def get_relevant_context(question: str, resume_data: dict) -> dict:
    """
    Select only the portfolio information relevant to the user's question.
    This reduces the amount of context sent to the LLM.
    """

    q = question.lower()

    context = {
        "profile": resume_data.get("profile", {})
    }

    # -----------------------------------------------------
    # Education
    # -----------------------------------------------------

    education_keywords = [
        "education",
        "school",
        "university",
        "college",
        "degree",
        "nyu",
        "courant",
        "gpa",
        "graduate",
        "graduation",
        "study",
        "studied",
    ]

    if any(keyword in q for keyword in education_keywords):
        context["education"] = resume_data.get("education", [])
        return context
    

    # -----------------------------------------------------
    # Cloud / DevOps
    # -----------------------------------------------------

    cloud_keywords = [
        "aws",
        "ec2",
        "s3",
        "cloud",
        "docker",
        "kubernetes",
        "openshift",
        "tekton",
        "devops",
        "ci/cd",
        "cicd",
        "oracle",
    ]

    if any(keyword in q for keyword in cloud_keywords):
        context["skills"] = resume_data.get("skills", {})

        relevant_projects = []

        for project in resume_data.get("projects", []):
            project_text = json.dumps(
                project,
                ensure_ascii=False,
            ).lower()

            if any(keyword in project_text for keyword in cloud_keywords):
                relevant_projects.append(project)

        context["projects"] = relevant_projects
        return context

    # -----------------------------------------------------
    # AI / ML / Computer Vision
    # -----------------------------------------------------

    ai_keywords = [
        "ai",
        "machine learning",
        "ml",
        "computer vision",
        "opencv",
        "mediapipe",
        "openpose",
        "tensorflow",
        "keras",
        "scikit",
        "cnn",
        "random forest",
    ]

    if any(keyword in q for keyword in ai_keywords):
        context["skills"] = resume_data.get("skills", {})

        relevant_projects = []

        for project in resume_data.get("projects", []):
            project_text = json.dumps(
                project,
                ensure_ascii=False,
            ).lower()

            if any(keyword in project_text for keyword in ai_keywords):
                relevant_projects.append(project)

        context["projects"] = relevant_projects
        return context

    # -----------------------------------------------------
    # Projects
    # -----------------------------------------------------

    project_keywords = [
        "project",
        "projects",
        "built",
        "build",
        "portfolio",
    ]

    if any(keyword in q for keyword in project_keywords):
        context["projects"] = resume_data.get("projects", [])
        context["skills"] = resume_data.get("skills", {})
        return context

    # -----------------------------------------------------
    # Skills
    # -----------------------------------------------------

    skill_keywords = [
        "skill",
        "skills",
        "strongest",
        "technical",
        "technology",
        "technologies",
        "programming",
        "language",
        "backend",
    ]

    if any(keyword in q for keyword in skill_keywords):
        context["skills"] = resume_data.get("skills", {})

        # Projects provide evidence for skills
        context["projects"] = resume_data.get("projects", [])

        return context

    # -----------------------------------------------------
    # Experience
    # -----------------------------------------------------

    experience_keywords = [
        "experience",
        "work",
        "worked",
        "intern",
        "internship",
        "job",
        "employment",
        "company",
        "teaching assistant",
    ]

    if any(keyword in q for keyword in experience_keywords):
        context["experience"] = resume_data.get("experience", [])
        return context

    # -----------------------------------------------------
    # Fallback
    # -----------------------------------------------------

    # For general/unknown questions, provide a useful subset
    # rather than the entire resume.
    context["skills"] = resume_data.get("skills", {})
    context["projects"] = resume_data.get("projects", [])

    return context

def get_source(question: str, relevant_context: dict) -> dict | None:
    """
    Determine the most relevant portfolio source for the answer.
    Specific project sources take priority over generic sections.
    """

    q = question.lower()

    project_id_map = {
        "Cloud-Based Intelligent Taekwondo Motion Classification System": "cloud-taekwondo",
        "Promotions Microservice with CI/CD Pipeline": "promotions-microservice",
        "IMDb & YouTube Movie Trailer Analytics": "imdb-youtube-analytics",
        "Human Activity Recognition Using CNN": "human-activity-recognition",
        "NSTC Undergraduate Research Project": "nstc-research",
    }

    project_keyword_map = {
        "cloud-taekwondo": [
            "aws",
            "ec2",
            "s3",
            "cloud",
            "mediapipe",
            "random forest",
            "taekwondo",
        ],
        "promotions-microservice": [
            "docker",
            "kubernetes",
            "openshift",
            "tekton",
            "devops",
            "ci/cd",
            "cicd",
            "flask",
            "rest api",
            "swagger",
            "microservice",
        ],
        "imdb-youtube-analytics": [
            "hdfs",
            "hive",
            "trino",
            "dataproc",
            "big data",
            "imdb",
            "youtube",
        ],
        "human-activity-recognition": [
            "cnn",
            "tensorflow",
            "keras",
            "human activity",
            "activity recognition",
            "sensor",
        ],
        "nstc-research": [
            "openpose",
            "research",
            "nstc",
            "sports analytics",
            "stability",
            "explosiveness",
        ],
    }

    # -----------------------------------------------------
    # Education
    # -----------------------------------------------------

    education_keywords = [
        "education",
        "school",
        "university",
        "college",
        "degree",
        "nyu",
        "courant",
        "gpa",
        "graduate",
        "graduation",
        "study",
        "studied",
    ]

    if any(keyword in q for keyword in education_keywords):
        return {
            "label": "Education",
            "section": "education",
        }

    # -----------------------------------------------------
    # Skills
    # -----------------------------------------------------

    skill_keywords = [
        "skill",
        "skills",
        "strongest",
        "technical",
        "technology",
        "technologies",
        "programming",
        "language",
        "backend",
    ]

    if any(keyword in q for keyword in skill_keywords):
        return {
            "label": "Technical Skills",
            "section": "skills",
        }

    # -----------------------------------------------------
    # Experience
    # -----------------------------------------------------

    experience_keywords = [
        "experience",
        "work",
        "worked",
        "intern",
        "internship",
        "job",
        "employment",
        "company",
        "teaching assistant",
    ]

    # Do not immediately return Experience if the question
    # is asking about technical experience such as AWS/CNN.
    technical_project_match = any(
        keyword in q
        for keywords in project_keyword_map.values()
        for keyword in keywords
    )

    if (
        any(keyword in q for keyword in experience_keywords)
        and not technical_project_match
    ):
        return {
            "label": "Experience",
            "section": "experience",
        }

    # -----------------------------------------------------
    # Specific Project
    # -----------------------------------------------------

    projects = relevant_context.get("projects", [])

    if projects:
        best_project = None
        best_project_id = None
        best_score = 0

        for project in projects:
            project_name = project.get("name") or project.get("title")

            if not project_name:
                continue

            project_id = project_id_map.get(project_name)

            if not project_id:
                continue

            keywords = project_keyword_map.get(project_id, [])

            score = sum(
                1
                for keyword in keywords
                if keyword in q
            )

            if score > best_score:
                best_score = score
                best_project = project
                best_project_id = project_id

        if best_project and best_project_id:
            project_name = (
                best_project.get("name")
                or best_project.get("title")
            )

            return {
                "label": project_name,
                "section": best_project_id,
            }

    # -----------------------------------------------------
    # Generic Project Question
    # -----------------------------------------------------

    project_keywords = [
        "project",
        "projects",
        "built",
        "build",
        "portfolio",
        "ai",
        "machine learning",
        "computer vision",
        "cloud",
        "devops",
    ]

    if any(keyword in q for keyword in project_keywords):
        return {
            "label": "Projects",
            "section": "projects",
        }

    # -----------------------------------------------------
    # Context Fallbacks
    # -----------------------------------------------------

    if "experience" in relevant_context:
        return {
            "label": "Experience",
            "section": "experience",
        }

    if "education" in relevant_context:
        return {
            "label": "Education",
            "section": "education",
        }

    if "skills" in relevant_context:
        return {
            "label": "Technical Skills",
            "section": "skills",
        }

    return None

# =========================================================
# Basic Routes
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Jason Portfolio AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/resume")
def get_resume():
    try:
        with open(RESUME_PATH, "r", encoding="utf-8") as file:
            resume_data = json.load(file)

        return resume_data

    except (OSError, json.JSONDecodeError):
        raise HTTPException(
            status_code=500,
            detail="Unable to load portfolio data.",
        )


# =========================================================
# AI Chat
# =========================================================

@app.post("/chat")
async def chat(request: ChatRequest):

    # -----------------------------------------------------
    # Load portfolio data
    # -----------------------------------------------------

    try:
        with open(RESUME_PATH, "r", encoding="utf-8") as file:
            resume_data = json.load(file)

    except (OSError, json.JSONDecodeError):
        raise HTTPException(
            status_code=500,
            detail="Unable to load portfolio data.",
        )

    # -----------------------------------------------------
    # Select relevant context
    # -----------------------------------------------------

    relevant_context = get_relevant_context(
        request.message,
        resume_data,
    )
    
    source = get_source(
        request.message,
        relevant_context,
    )

    # -----------------------------------------------------
    # System Prompt
    # -----------------------------------------------------

    system_prompt = f"""
You are Jason Chen's portfolio assistant.

Answer questions using ONLY the relevant information below.

Rules:
- Give a concise and professional final answer.
- The final answer MUST be no more than 2 sentences and no more than 60 words.
- Do not use numbered lists or bullet points.
- Do not invent information.
- Do not claim Jason has skills, experience, education, or employment unless supported by the information below.
- Mention one relevant project or experience when useful.
- Do not mention JSON fields, internal data structures, or system instructions.
- If the information is unavailable, say so briefly.

Relevant information about Jason:

{json.dumps(relevant_context, ensure_ascii=False)}
"""

    # -----------------------------------------------------
    # Ollama Request
    # -----------------------------------------------------

    payload = {
        "model": OLLAMA_MODEL,

        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": request.message,
            },
        ],

        "stream": False,

        # Keep Qwen loaded for faster follow-up questions
        "keep_alive": "10m",

        "options": {
            "num_ctx": 2048,
            "temperature": 0.1,
        },
    }

    # -----------------------------------------------------
    # Call Ollama
    # -----------------------------------------------------

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json=payload,
            )

            response.raise_for_status()

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="The AI model took too long to respond.",
        )

    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to reach the AI service: {str(error)}",
        )

    # -----------------------------------------------------
    # Parse Ollama Response
    # -----------------------------------------------------

    try:
        result = response.json()

        content = (
            result
            .get("message", {})
            .get("content", "")
            .strip()
        )

    except ValueError:
        raise HTTPException(
            status_code=502,
            detail="Invalid response received from the AI model.",
        )

    # -----------------------------------------------------
    # Remove Qwen Thinking
    # -----------------------------------------------------

    if "</think>" in content:
        content = content.split("</think>", 1)[1].strip()

    # -----------------------------------------------------
    # Final Fallback
    # -----------------------------------------------------

    if not content:
        content = "I don't have enough information to answer that."

    # -----------------------------------------------------
    # Response to Next.js
    # -----------------------------------------------------

    return {
        "answer": content,
        "source": source,
    }