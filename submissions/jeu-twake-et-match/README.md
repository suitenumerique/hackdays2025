# 🏆 Final Submission for Jeu Twake et Match

## Project
From RAG to RAW (Retrieval Augmented Workplace)

## Project Description
A personal AI leveraging all your workplace contents, thanks to a common data platform


## Contributors
<a href="https://github.com/benibur">@benibur</a>, <a href="https://github.com/zatteo">@zatteo</a>, <a href="https://github.com/paultranvan">@paultranvan</a>, <a href="https://github.com/benjaminbellamy">@benjaminbellamy</a>, <a href="https://github.com/dodekapode">@dodekapode</a>, <a href="https://github.com/Ahmath-Gadji">@Ahmath-Gadji</a>

## Code base


- Backend : https://github.com/cozy/cozy-stack
- RAG : https://github.com/OpenLLM-France/RAGondin
- Fork Docs : https://github.com/cozy/lasuite-docs
- Embedded Docs in Cozy : https://github.com/cozy/cozy-lasuite-docs
- Cozy Drive : https://github.com/cozy/cozy-drive/tree/hackdays
- Communication data platform : https://github.com/cozy/cozy-libs/tree/master/packages/cozy-external-bridge



## Deliverables 
(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

A live and functional workplace, with RAG:

https://hackdays-home.on.cozy.lin-saas.com/


## Key Achievements

A workplace enhancing independant apps by providing platform features such as global search, AI assistant, links between apps, etc.

The Twake workplace is able to integrate applications from la Suite, such as Docs, Grist or Visio.
We focused on Docs to develop those features:

- Creation and display of Docs from Twake Drive
- Easy link creation inside Docs notes to Drive files.
- Automatic indexing of Docs notes into a global search
- Automatic indexing of Docs notes into a RAG
- An AI assistant able to answer questions on Docs notes 



## Challenges Overcome
(What was difficult? What did you solve?)

- Integration of any application into a generic and open workplace
  - Example: Docs, Grist and Visio are integrated into Twake workplace through a generic React wrapper
- Generic data communication between apps and platform
  - Example: A Docs note is automatically saved and synchronized as markdown into the data platform
  - Then, any Docs benefits from the platform features leveraging markdown format, such as global search, RAG indexation, etc.   
- Realtime RAG indexation of documents
  - Any creation, update or deletion of any file in the workplace is automatically propagated to the RAG indexer
- Efficient RAG retrieval to target relevant documents and provide useful answer to user request
  - It is very challenging to extract correct chunks regarding a query: we implemented an innovative map-reduce strategy to efficiently combine semantic search and LLM evaluation



## Impact

Applications editors can benefit from the Twake workplace by leveraging platform capabilities to offer better user experience.
Users benefit from the platform navigation, unified UX and features and efficiently manage their digital life. 



## Next Steps


- RAG improvements: indexing and retrieval for better and faster answers
- Better UX
- Sharing functionalities
- Handle Grist documents to provide platform features
