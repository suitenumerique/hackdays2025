[# 🏆 Final Submission for OpeNova

## Project
RAG on Drive

## Project Description
Store shared files as vector database so they can query an LLM pipeline


## Contributors
<a href="https://github.com/AlexandreAmate">@AlexandreAmate</a>, <a href="https://github.com/Roswell1208">@Roswell1208</a>, <a href="https://github.com/tgreil">@tgreil</a>

## Code Base  
👉 [GitHub Repository](https://github.com/tgreil/drive/tree/main)


## Deliverables  
[Vector Database implementation on drive.pptx](https://github.com/user-attachments/files/20575352/Vector.Database.implementation.on.drive.pptx)



## Key Achievements  
✅ Built a **Vector Database (ChromaDB)** integrated into a Drive-like environment.  
✅ Developed APIs to:  
- **Add a document** to the vector store when uploaded to a workspace.  
- **Delete a document** from the vector store when removed from the workspace.  
- **Query documents** by context similarity, given a prompt and desired number of results.  
✅ Created a **CustomEmbeddingAPI** to support multiple embedding models.  
✅ Integrated an **OCR API** to extract text from images and scanned documents.  
✅ Designed the system to be **LLM-agnostic**: any LLM can be plugged in for RAG tasks.  
✅ **Scalability ensured** by aligning storage architecture: files are stored both in the Drive and the vector database.  

## Challenges Overcome  
🚧 API development for seamless document ingestion and search.  
🚧 Handling heterogeneous file formats and integrating OCR pipelines for non-textual content.  
🚧 Dockerization challenges for deployment, currently in progress.  
🚧 Ensuring architecture coherence between application layers and distributed storage.  

## Impact  
🌍 **End Users**: Faster and more intuitive document search through semantic understanding.  
🌍 **Companies**: Improved knowledge management and document retrieval across teams.  
🌍 **Developers**: Modular API, ready to integrate into any RAG or advanced search solution.  

## Next Steps  
🚀 Finalize **Docker containerization** for smooth deployment.  
🚀 Extend features with:  
- **Automatic document clustering**.  
- **Advanced search** integrated into the Drive search bar.  
- **Automatic summarization** and **context-aware suggestions**.  
🚀 Deploy in a **cloud environment** for scalability testing.  
🚀 Integrate state-of-the-art LLMs (Claude, GPT-4-turbo, Mistral, etc.).  

---

**Big thanks to the entire OpeNova team for their incredible work on this project during the Hackdays!** 🎉
