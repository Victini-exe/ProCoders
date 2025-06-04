import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import MinMaxScaler


products_df = pd.read_excel("ecofinds_trending_dataset.xlsx", sheet_name="Products")
sellers_df = pd.read_excel("ecofinds_trending_dataset.xlsx", sheet_name="Sellers")
reviews_df = pd.read_excel("ecofinds_trending_dataset.xlsx", sheet_name="Reviews")


seller_sales = products_df.groupby("seller_id")[["views", "times_saved", "sold_count"]].sum().reset_index()
product_seller_map = products_df[["product_id", "seller_id"]]
seller_reviews = reviews_df.merge(product_seller_map, on="product_id")
seller_avg_rating = seller_reviews.groupby("seller_id")["rating"].mean().reset_index()


seller_data = sellers_df.merge(seller_sales, on="seller_id", how="left").merge(seller_avg_rating, on="seller_id", how="left").fillna(0)


seller_data["seller_score"] = (
    0.3 * seller_data["views"] +
    0.5 * seller_data["times_saved"] +
    1.0 * seller_data["sold_count"] +
    1.5 * seller_data["rating"] +
    1.2 * seller_data["seller_rating"]
)


scaler = MinMaxScaler()
seller_data["seller_score_scaled"] = scaler.fit_transform(seller_data[["seller_score"]])
threshold = seller_data["seller_score_scaled"].quantile(0.75)
seller_data["label"] = (seller_data["seller_score_scaled"] >= threshold).astype(int)


X_seller = seller_data[["views", "times_saved", "sold_count", "rating", "seller_rating"]]
y_seller = seller_data["label"]
X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_seller, y_seller, test_size=0.2, random_state=42)

model_trending_sellers = RandomForestClassifier(n_estimators=100, random_state=42)
model_trending_sellers.fit(X_train_s, y_train_s)
y_pred_s = model_trending_sellers.predict(X_test_s)


print("Trending Sellers Classification Report:")
print(classification_report(y_test_s, y_pred_s))
