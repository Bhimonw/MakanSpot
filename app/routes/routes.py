from flask import Blueprint, request, jsonify
from app.services.recommendation_service import get_recommendations

bp = Blueprint('main', __name__)

@bp.route('/api/recommendations', methods=['POST'])
def recommendations():
    data = request.get_json()
    # Validasi input
    if not data or not all(k in data for k in ('price_range', 'min_rating', 'max_distance')):
        return jsonify({'error': 'Missing required fields: price_range, min_rating, max_distance'}), 400
    try:
        price_range = int(data['price_range'])
        min_rating = float(data['min_rating'])
        max_distance = float(data['max_distance'])
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid input type. price_range (int), min_rating (float), max_distance (float) required.'}), 400
    result = get_recommendations(price_range, min_rating, max_distance)
    # Convert list of TempatMakan to list of dict
    return jsonify([t.to_dict() for t in result]) 