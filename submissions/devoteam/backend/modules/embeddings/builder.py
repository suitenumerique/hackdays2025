import faiss

def embed_chunks(chunks, model):
    embeddings = model.encode(chunks, convert_to_numpy=True)
    return embeddings
    
def build_faiss_index(embeddings):
    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(embeddings)
    return index