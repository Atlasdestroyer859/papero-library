import pandas as pd
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

class Recommender:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), 'data', 'catalog.json')
        self.df = self._load_data()
        self.cosine_sim = self._train_model()

    def _load_data(self):
        """Loads book data from JSON into a Pandas DataFrame."""
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        return pd.DataFrame(data)

    def _train_model(self):
        """Trains the Content-Based Filtering Model."""
        # Create a "soup" of metadata (Category + Description)
        # This tells the AI what the book is "about"
        self.df['soup'] = self.df['category'] + " " + self.df['description']
        
        # Convert text to Matrix of token counts (TF-IDF)
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df['soup'])
        
        # Calculate Cosine Similarity Matrix
        # (How similar is every book to every other book?)
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
        return cosine_sim

    def get_recommendations(self, title):
        """Returns top 5 recommended books given a book title."""
        # Check if book exists
        if title not in self.df['title'].values:
            # Fallback: Return top books generic
            return self.df.head(3).to_dict('records')

        # Get index of the book
        idx = self.df.index[self.df['title'] == title][0]

        # Get similarity scores for all books with this book
        sim_scores = list(enumerate(self.cosine_sim[idx]))

        # Sort books based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get top 5 (excluding the book itself)
        sim_scores = sim_scores[1:6]
        book_indices = [i[0] for i in sim_scores]

        # Return the actual book objects
        return self.df.iloc[book_indices].to_dict('records')
