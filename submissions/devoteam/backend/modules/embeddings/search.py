import numpy as np
def search_best_chunks(index, query_embedding, k=8):
    distances, indices = index.search(np.array([query_embedding]), k)
    return indices[0]