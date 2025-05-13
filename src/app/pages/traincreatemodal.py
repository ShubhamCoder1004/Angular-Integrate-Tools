import xgboost as xgb
import numpy as np
import pandas as pd
import argparse
import os

def train_lead_score_model(data: pd.DataFrame, labels: list, model_path: str = 'lead_scoring_model.json'):
    """
    Train a lead score prediction model using XGBoost and save it to a file.

    Args:
        data (pd.DataFrame): DataFrame containing feature columns.
        labels (list): List or array of target labels (lead scores).
        model_path (str): Path to save the trained model.
    """
    # Convert to DMatrix format for XGBoost
    dtrain = xgb.DMatrix(data, label=labels)

    # Define model parameters
    params = {
        'objective': 'binary:logistic',  # For binary classification
        'eval_metric': 'logloss'
    }

    # Train the model
    model = xgb.train(params, dtrain, num_boost_round=10)

    # Save the trained model
    model.save_model(model_path)
    print(f"Model saved to {model_path}")

def load_data_from_csv(csv_path: str, label_column: str):
    """
    Load features and labels from a CSV file.

    Args:
        csv_path (str): Path to the CSV file.
        label_column (str): Name of the column to use as the label.

    Returns:
        data (pd.DataFrame): Feature data.
        labels (list): Target labels.
    """
    df = pd.read_csv(csv_path)
    if label_column not in df.columns:
        raise ValueError(f"Label column '{label_column}' not found in CSV.")
    labels = df[label_column].values
    data = df.drop(columns=[label_column])
    return data, labels

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train lead score model with dynamic data.")
    parser.add_argument('--csv', type=str, help='Path to CSV file containing training data.')
    parser.add_argument('--label', type=str, default='Lead_Score', help='Name of the label column in the CSV.')
    parser.add_argument('--model-path', type=str, default='lead_scoring_model.json', help='Path to save the trained model.')
    args = parser.parse_args()

    if args.csv:
        if not os.path.exists(args.csv):
            print(f"CSV file {args.csv} does not exist.")
            exit(1)
        data, labels = load_data_from_csv(args.csv, args.label)
        train_lead_score_model(data, labels, args.model_path)
    else:
        # Sample data for training (for demonstration purposes)
        data = pd.DataFrame({
            'Budget': [8500000, 5500000, 12000000],
            'Interaction_Count': [7, 2, 10],
            'Site_Visit_Completed': [1, 2,3],
            'Project_Match_Score': [0.9, 0.6, 0.95],
            'Engagement_Score': [85, 45, 90]
        })

        labels = [1, 0, 1]  # Example labels (1 = high lead score, 0 = low lead score)

        print("Using sample data. For real training, provide a CSV file with --csv argument.")
        print("Example usage: python traincreatemodal.py --csv your_data.csv --label Lead_Score")
        
        # Train and save the model with sample data
        train_lead_score_model(data, labels, args.model_path)
