import pickle
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS


movies = pd.read_csv("movies.csv")  
with open("movie_similarity.pkl", "rb") as file:
    movie_similarity = pickle.load(file)


movie_id_map = dict(zip(movies['title'], movies['movieId']))

app = Flask(__name__)
CORS(app)  

@app.route('/recommend', methods=['GET'])
def recommend():
    movie_name = request.args.get('movie_name')

    if not movie_name:
        return jsonify({"error": "Movie name is required"}), 400
    
    
    movie_id = movie_id_map.get(movie_name)
    
    if movie_id is None:
        return jsonify({"error": "Movie not found"}), 404

    
    try:
        similar_movies = movie_similarity.loc[movie_id].sort_values(ascending=False)[1:6]
        recommended_movie_ids = similar_movies.index.tolist()
        
        
        recommended_movies = movies[movies['movieId'].isin(recommended_movie_ids)]['title'].tolist()
        
        return jsonify(recommended_movies)
    
    except KeyError:
        return jsonify({"error": "Movie not found in dataset"}), 404

if __name__ == '__main__':
    app.run(debug=True)
