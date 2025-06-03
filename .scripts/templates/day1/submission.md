# 🚀 Day 1 Pitch Submission for DBT

## Project Idea
Fact-checking functionality for collaborative documents via an integrated AI tool.

## Problem Statement
Misinformation is a growing threat to public discourse, especially in collaborative digital environments. Users working in shared documents often make factual claims without a quick and reliable way to verify them. This can lead to the unintentional spread of false or unsupported information, weakening trust and accuracy in digital collaboration tools.

## Target Users
Public sector employees, journalists, educators, policy analysts, researchers, and anyone using open-source collaborative tools like Docs for information-sharing and co-authoring content. Particularly valuable for those working in multilingual, cross-border European teams where accuracy and credibility are critical.

## Solution Summary
We are building FactVerifAi, an AI-powered fact-checking tool integrated into Docs, an open-source collaborative document editor. Users can highlight any piece of text and trigger the tool to assess its factual accuracy. The system uses a language model (currently Ollama 3.1, interchangeable) and an external API to search the internet for credible sources, returning a factual accuracy score (0–100%) with an explanation and a transparent list of sources. This ensures real-time, context-aware verification while maintaining transparency, data protection, and interoperability with European digital infrastructure values.

## Tech Stack Proposal
Python – backend development and API integration
Ollama 3.1 (or interchangeable LLMs) – natural language understanding
External fact-checking & news APIs – for cross-referencing claims with real-time online data
JavaScript / TypeScript – for frontend integration into Docs
La Suite / Docs platform – for collaborative document interface
Docker – for containerization and ease of deployment
GitLab / GitHub – for version control and open-source collaboration