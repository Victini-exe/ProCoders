import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


file_path = "ecofinds_synthetic_dataset_100.xlsx"
users_df = pd.read_excel(file_path, sheet_name='Users')
products_df = pd.read_excel(file_path, sheet_name='Products')
interactions_df = pd.read_excel(file_path, sheet_name='Interactions')
reviews_df = pd.read_excel(file_path, sheet_name='Reviews')


avg_ratings = reviews_df.groupby("product_id")["rating"].mean().reset_index().rename(columns={"rating": "avg_rating"})
products_df = products_df.merge(avg_ratings, on="product_id", how="left").fillna({"avg_rating": 3.0})

products_df["text_features"] = products_df["category"] + " " + products_df["description"]
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(products_df["text_features"])


def get_user_profile(user_id):
    interacted = interactions_df[
        (interactions_df["user_id"] == user_id) &
        (interactions_df["action"].isin(["purchased", "saved"]))
    ]["product_id"].unique()
    
    indices = [products_df[products_df["product_id"] == pid].index[0] for pid in interacted if pid in products_df["product_id"].values]
    
    if not indices:
        return None

    user_profile_vector = tfidf_matrix[indices].mean(axis=0)
    return np.asarray(user_profile_vector).reshape(1, -1)  




def recommend_products(user_id, top_n=5):
    user_profile_vector = get_user_profile(user_id)
    if user_profile_vector is None:
        return f"User {user_id} has no sufficient history for recommendations."

    
    cosine_sim = cosine_similarity(user_profile_vector, tfidf_matrix).flatten()

    
    scores_df = products_df[["product_id", "title", "category", "avg_rating"]].copy()
    scores_df["cosine_score"] = cosine_sim
    scores_df["sentiment_boost"] = scores_df["avg_rating"] / 5 + 0.5

    
    interacted = set(interactions_df[
        (interactions_df["user_id"] == user_id) & 
        (interactions_df["action"].isin(["purchased", "saved"]))
    ]["product_id"].tolist())
    scores_df = scores_df[~scores_df["product_id"].isin(interacted)]

    
    scores_df["final_score"] = scores_df["cosine_score"] * scores_df["sentiment_boost"]
    recommended = scores_df.sort_values(by="final_score", ascending=False).head(top_n)

    return recommended[["product_id", "title", "category", "avg_rating", "final_score"]]

