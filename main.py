from flask import Flask, jsonify,request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

API_KEY = "99a57f5da4d241cab98fbc28b00bf871"

@app.route("/api/news")
def get_news():
    category = request.args.get("category", "india")

    url = f"https://newsapi.org/v2/everything?q={category}&apiKey={API_KEY}"

    try:
        res = requests.get(url, timeout=5)
        data = res.json()
    except Exception as e:
        return jsonify({"error": "Failed to fetch news"}), 500

    if data.get("status") != "ok":
        return jsonify({"error": data.get("message", "API error")}), 400

    news = []

    for article in data.get("articles", [])[:10]:
        news.append({
            "headline": article.get("title") or "No title available",
            "url": article.get("url") or "#",
            "source": article.get("source", {}).get("name", "Unknown"),
            "image": article.get("urlToImage"), 
            "publishedAt": article.get("publishedAt")
        })

    return jsonify(news)

@app.route("/api/news")
def scrape_article(url):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        res = requests.get(url, headers=headers, timeout = 5)
        soup = BeautifulSoup(res.text, "html.parser")

        paragraphs = soup.find_all("p")
        content = "".join([p.get_text() for p in paragraphs])

        images = []
        for img in soup.find_all("img"):
            img_url = img.get("src")
            if img_url and img_url.startswith("http"):
                images.append(img_url)
        return {
            "content": content[:5000], 
            "images": images[:5]
        }
    
    except Exception as e:
        return {
            "content": "Failed to scrape the article.",
            "images": []
        }

@app.route("/api/article")
def get_article():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "No URL provided."})
    
    data = scrape_article(url) 
    return jsonify(data) 

if __name__ == "__main__":
    app.run(debug=True)