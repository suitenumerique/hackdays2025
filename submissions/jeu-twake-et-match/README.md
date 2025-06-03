# 🏆 Final Submission for Jeu Twake et Match

## Project
From RAG to RAW (Retrieval Augmented Workplace)

## Project Description
A personal AI leveraging all your workplace contents, thanks to a common data platform


## Contributors
<a href="https://github.com/benibur">@benibur</a>, <a href="https://github.com/zatteo">@zatteo</a>, <a href="https://github.com/paultranvan">@paultranvan</a>, <a href="https://github.com/benjaminbellamy">@benjaminbellamy</a>, <a href="https://github.com/dodekapode">@dodekapode</a>, <a href="https://github.com/Ahmath-Gadji">@Ahmath-Gadji</a>

## Code base

- Communication data platform : https://github.com/cozy/cozy-libs/tree/master/packages/cozy-external-bridge
- Docs front container in Cozy : https://github.com/cozy/cozy-lasuite-docs
- Docs integration of CozyBridge : https://github.com/cozy/lasuite-docs
- RAG : https://github.com/OpenLLM-France/RAGondin
- Backend : https://github.com/cozy/cozy-stack
- Cozy Drive : https://github.com/cozy/cozy-drive/tree/hackdays



## Deliverables 
(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

A live and functional workplace with :
1. apps integration : Docs, Grist and Visio integrated with Bitwarden, Cozy Drive and Twake Mail
2. transversal features :
  * Docs in Drive (creation, access & sharing)
  * Sharing managed by folder in Drive, not in Docs
  * autocomplete to insert in Docs a links to any document in the workplace
3. with a RAG indexing in real time the content from Docs !

* url : https://hackdays-home.on.cozy.lin-saas.com/
* login : hackdays@cozy.lin-saas.com
* password : Hackdays25


## Key Achievements

A workplace enhancing independant apps by providing platform features such as global search, AI assistant, links between apps, etc.

The Twake workplace is able to integrate any applications from la Suite or other, such as Docs, Grist or Visio or Bitwarden, or OnlyOffice or Calcs ...

We focused on Docs to develop those features:

1. Creation and display of Docs from Twake Drive
1. Easy link creation inside Docs notes to any object in the platform
1. Automatic indexing of Docs notes into a global search
1. Automatic indexing of Docs notes into a RAG
1. An AI assistant able to answer questions on Docs notes (and of course any docs from any apps from the platform)



## Challenges Overcome
(What was difficult? What did you solve?)

- **Integration of any application into a generic and open workplace**
  - Example: Docs, Grist and Visio are integrated into Twake workplace through a generic React wrapper
- **Generic data communication between apps and platform** : CozyBridge frontend library
  - Example: A Docs note is automatically saved and synchronized as markdown into the data platform
  - Then, any Docs benefits from the platform features leveraging markdown format, such as global search, RAG indexation, etc.
  - one of our strenght is to organize the platform communication on the client side rather than on the server side. It greatly simplifies right management (the user's session already handles this for us, for free !)
- **Realtime RAG indexation of documents** from any app, including Docs
  - Any creation, update or deletion of any file in the workplace is automatically propagated to the RAG indexer
- **Efficient RAG retrieval to target relevant documents** and provide useful answer to user request
  - It is very challenging to extract correct chunks regarding a query: we implemented an innovative map-reduce strategy to efficiently combine semantic search and LLM evaluation



## Impact

Apps are no more silos. We can add an app with minimalistic modification on the client side.
Applications can then leverage platform capabilities to offer better user experience :
* all documents ordered in the drive
* sharing are organized around folders aggregating all the documents of a subject. No more sharing in Docs, in Grist, in Drive, in Pass...
* Users benefit from the platform navigation, unified UX and features and efficiently manage their digital life.
* mobile : any app of the platform can be accessed from a native mobile app, from the platform super app.



## Next Steps


- Handle Grist documents to provide platform features
- RAG improvements: indexing and retrieval for better and faster answers
- Better UX for search of documents in Docs
- Sharing functionalities
- Edition of Docs directly in Drive (embeded editor for better experience)


