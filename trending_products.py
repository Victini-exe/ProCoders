import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import MinMaxScaler


products_df = pd.read_excel("ecofinds_trending_dataset.xlsx", sheet_name="Products")
interactions_df = pd.read_excel("ecofinds_trending_dataset.xlsx", sheet_name="Interactions")
product_popularity = interactions_df.groupby(["product_id", "action"]).size().unstack(fill_value=0).reset_index()
product_data = products_df.merge(product_popularity, on="product_id", how="left").fillna(0)


product_data["trending_score"] = (
    0.5 * product_data["view"] +
    0.7 * product_data["saved"] +
    1.0 * product_data["purchased"] +
    0.3 * product_data["views"] +
    0.5 * product_data["times_saved"] +
    0.8 * product_data["sold_count"]
)

scaler = MinMaxScaler()
product_data["trending_score_scaled"] = scaler.fit_transform(product_data[["trending_score"]])
threshold = product_data["trending_score_scaled"].quantile(0.75)
product_data["label"] = (product_data["trending_score_scaled"] >= threshold).astype(int)


X_product = product_data[["view", "saved", "purchased", "views", "times_saved", "sold_count"]]
y_product = product_data["label"]
X_train, X_test, y_train, y_test = train_test_split(X_product, y_product, test_size=0.2, random_state=42)

model_trending_products = RandomForestClassifier(n_estimators=100, random_state=42)
model_trending_products.fit(X_train, y_train)
y_pred = model_trending_products.predict(X_test)

print("Trending Products Classification Report:")
print(classification_report(y_test, y_pred))
