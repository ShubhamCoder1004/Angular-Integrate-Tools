import logging
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import xgboost as xgb
import numpy as np

# Set up logging
logging.basicConfig(
    filename='prediction_requests.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (this will allow all origins)
CORS(app)

# Alternatively, you can enable CORS for a specific route:
# CORS(app, resources={r"/predict_bulk": {"origins": "http://localhost:4200"}})

# Load the trained model
model = xgb.XGBClassifier()
model.load_model('lead_scoring_model.json')

def predict_lead_score(lead_data, model):
    """
    Predict the lead score using the provided model and lead data.

    Args:
        lead_data (dict): Dictionary containing lead features.
        model (xgb.XGBClassifier): Trained XGBoost model.

    Returns:
        int: Predicted lead score.
    """
    try:
        features = np.array([[
            lead_data['Budget'],
            lead_data['Interaction_Count'],
            lead_data['Site_Visit_Completed'],
            lead_data['Project_Match_Score'],
            lead_data['Engagement_Score']
        ]])
        prediction = model.predict(features)
        return int(prediction[0])
    except Exception as e:
        logging.error(f"Error predicting lead score for data {lead_data}: {e}")
        return None

@app.route('/predict_bulk', methods=['POST'])
def predict_bulk():
    data = request.get_json()
    predictions = []
    
    # Log the incoming request data
    logging.info(f"Received request data: {data}")
    
    for lead_data in data:
        lead_score = predict_lead_score(lead_data, model)
        predictions.append({"lead_score": lead_score})
        # Log each prediction
        logging.info(f"Lead data: {lead_data} => Prediction: {lead_score}")

    # Log the final predictions list
    logging.info(f"Final predictions: {predictions}")

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
