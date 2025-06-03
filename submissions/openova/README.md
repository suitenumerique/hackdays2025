Final Submission for OpeNova
Project
RAG on Drive

Project Description
Store shared files as a vector database so they can be queried by an LLM pipeline. The goal is to enhance file search capabilities within a Drive-like platform by enabling semantic search, document clustering, and retrieval-augmented generation (RAG) functionalities using vector embeddings.

Contributors
@AlexandreAmate

@Roswell1208

@tgreil


Code base
👉 [GitHub Repository](url)

Deliverables


Key Achievements
Implemented a Vector Database (ChromaDB) integrated into a Drive-like environment.

Built APIs to:

Add documents to the vector store when uploaded to a workspace.

Delete documents when removed from the workspace.

Query documents via an API with a given prompt and desired number of results.

Created a CustomEmbeddingAPI supporting multiple embedding models.

Integrated an OCR API for document text extraction (from images or scanned files).

Designed the system to be LLM-agnostic: Any LLM can be plugged in for RAG tasks.

Paved the way for contextual search within Drive, enhancing file discovery.

Challenges Overcome
Developed robust APIs for file management within the Vector DB.

Solved technical hurdles around document ingestion and retrieval pipelines.

Worked through Dockerization challenges (currently in progress).

Ensured scalability by aligning the architecture with the Drive's storage model (dual storage: Drive + Vector DB).

Impact
This project empowers:

End users: Improved document search via semantic understanding.

Companies: Enhanced knowledge management and internal file retrieval.

Developers: Plug-and-play API for integrating any LLM for RAG pipelines.

Next Steps
Finalize Docker integration for seamless deployment.

Refine and test the end-to-end workflow within cloud environments.

Expand the system to handle larger file volumes and streamlined clustering.

Explore advanced features like document summarization, context-aware recommendations, and real-time indexing.

