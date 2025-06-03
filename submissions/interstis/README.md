# 🏆 Final Submission for Interstis

## Project
Resana & Co

## Project Description
Albert API implementation in Resana, search document, sum up dialogues and more


## Contributors
<a href="https://github.com/romaindebrito">@romaindebrito</a>, <a href="https://github.com/@Anthony-Dmn">@Anthony-Dmn</a>

## Code base

The code base is shared across all RESANA microservices, but it is not currently available in a public repository.

As part of this Proof of Concept (POC), we integrated selected functionalities from the Albert API, primarily through its gateway.

The key technical components involved are:

Kafka: used for message handling and asynchronous communication between services.

PHP (RESANA core): serves as the foundational framework for business services.

N8N: acts as a worker to automate tasks and ensure interoperability between services.

Node.js: handles real-time dialogue management.

The project is built on a distributed architecture combining AI capabilities, document processing, and real-time integration within RESANA. Here’s a breakdown of the key technical components:

🔌 1. Use of Albert API (Gateway)
Prompt fine-tuning:
Carefully tailored prompts guide Albert’s behavior and ensure responses are aligned with RESANA-specific use cases.

Querying RESANA's internal documentation:
Dynamic connection allows Albert to access and leverage internal content repositories in real time based on user queries.

Document snippet segmentation:
Documents are automatically broken down into contextually relevant excerpts to improve the precision and focus of AI responses.

🧩 2. Integration into RESANA
Real-time AI chat integration:
A live chat component was embedded directly into RESANA’s interface, enabling users to consult Albert at any moment.

Technologies used:

PHP: integration with the RESANA application core

Node.js: management of real-time exchanges

Markdown rendering: ensures well-formatted, readable AI responses

Smart document indexing pipeline:
An automated workflow processes and indexes content from various file formats (PDF, Docx, Excel, TXT) as they are uploaded to RESANA.

Components used:

RESANA Core GED: for document access and metadata extraction

Kafka: message broker to coordinate processing events

N8N: workflow automation tool to extract, transform, and send data to the Albert API

## Deliverables 

A live demo is available on an internal testing platform (Interstis), featuring a real-time integration of the Albert API.
You can view video and screenshot to demo application. In presentation, we can share a live demo in stagging env.

This test platform provides the following capabilities:

Respond to all user requests using the Albert AI, powered by the Albert model.

Automatically analyze and extract content from uploaded documents in various formats: PDF, Excel, Docx, or TXT.

Query the document database via Albert for each user request, when relevant, to enhance the response.

Samples dialog with IA

[Dialog hackdays content](./assets/dialog_with_IA.png)

[Dialog with train time](./assets/dialog2_with_IA.png)

[Workflow N8N to push datas in Albert](./assets/push_datas_in_albert.png)

[Extract content document](./assets/result-extract-content-docs.png)

[Result messaging in broker message Kafka](./assets/messaging-datas-broker.png)

## Key Achievements

Key Work Completed:
Use of the Albert API (Gateway)

Prompt fine-tuning with the Albert model to better frame and guide the AI’s responses.

Querying the RESANA documentation database: implemented a mechanism for dynamically consulting existing documentation at each user request.

Smart document snippet segmentation: designed to send only the most relevant content to Albert by contextually breaking down document sections.

Integration into RESANA

Embedding AI chat in existing dialogue flows: added a component that allows users to interact with the AI at any time via the Albert API in real time. This was implemented using PHP (RESANA core) and Node.js (for real-time communication). Response rendering also supports Markdown for improved readability.

Document indexing system: automated extraction of content from PDF, Docx, Excel, and TXT files using a pipeline built with the RESANA Core GED, Kafka (as message broker), and N8N (as a worker to push data into the Albert API).

## Challenges Overcome

Adapting data to enable information transmission to Albert
It was necessary to normalize and restructure data from various sources (documents, forms, events) so that it could be understood and processed by the Albert AI. This data transformation was essential to ensure the relevance and accuracy of the AI-generated responses.

Adapting the current dialogue structure to support real-time interaction with the AI
The initial dialogue system was not designed for real-time interaction with an AI. The conversational architecture had to be rethought to allow fluid, dynamic exchanges by integrating calls to the Albert API within the existing workflow.

## Impact

User Pain Points:
How to easily find a document in RESANA?
Users struggle to quickly locate specific documents in a growing volume of information. Traditional keyword-based search becomes ineffective when the user doesn’t know the exact title, folder, or metadata of the document they’re looking for.

How to summarize a set of documents in RESANA?
When dealing with a large number of documents related to the same topic (e.g., in a project space or thematic GED), there’s no easy way to generate a contextual, automated summary that can support decision-making or enable rapid sharing.

How to generate new document content from existing templates?
Users often need to produce new content (such as meeting minutes, memos, or reports) based on existing documents. They expect a tool that can automate the generation of a structured draft using reference materials, while allowing them to tailor the tone and format as needed.

## Next Steps

Next Steps: Moving Toward Scalable Intelligence and Deeper Integration
The first phase has validated both the feasibility and the added value of integrating Albert into the RESANA ecosystem. The next step is to scale up, industrialize, and deepen the use of AI to provide high-value, context-aware assistance.

Key short-term objectives:

1- Integration of a vector database into RESANA
Explore embedding a native vector database within RESANA, allowing the Albert API to query indexed data directly. The goal is to reduce heavy data transfers and increase both speed and response accuracy.

2- Structuring and isolating data using metadata and filters
Define a model to partition and control access to data using filters, metadata, and access rules, in order to guide and secure the interaction with Albert.

3- Fine-tuning prompts to support deeper data analysis
Optimize the prompts to enable more advanced data analysis and open the door to new functional use cases such as decision support, project assistance, or automated generation of specialized content.

4- Identify asynchronous automation opportunities
Deploy mechanisms that:

- Automatically summarize activity over a given time period (e.g., a weekly summary for a space or project)
- Provide intelligent summaries of notifications received by a user
- Automatically feed existing RESANA content into the Albert API, creating an up-to-date initial dataset that’s immediately usable.

This roadmap (initiative) aims to transform integration Albert with RESANA into a proactive, intelligent co-pilot, not just reactive to queries, but capable of anticipating user needs and assisting in day-to-day collaborative workflows.
