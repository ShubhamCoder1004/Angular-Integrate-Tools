import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({ providedIn: 'root' })
export class LeadScoreService {
  private model: any;
  private modelTrained = false;
  private readonly MODEL_URL = 'indexeddb://lead-score-model';

  constructor() {}

  private buildModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 10, inputShape: [5], activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    this.model.compile({
      loss: 'binaryCrossentropy',
      optimizer: 'adam',
      metrics: ['accuracy'],
    });
  }

  async loadOrCreateModel() {
    try {
      this.model = await tf.loadLayersModel(this.MODEL_URL);
      this.modelTrained = true;
      console.log('✅ Loaded saved model from IndexedDB');
    } catch {
      console.log('⚠️ No saved model found. Creating new model.');
      this.buildModel();
    }
  }

  async trainModel(trainingData: number[][], labels: number[]) {
    if (this.modelTrained) return; // skip if already trained

    const xs = tf.tensor2d(trainingData);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    await this.model.fit(xs, ys, {
      epochs: 100,
    });

    await this.model.save(this.MODEL_URL); // Save after training
    this.modelTrained = true;
    console.log('✅ Model trained and saved to IndexedDB');
  }

  predictScore(input: number[]): number {
    const inputTensor = tf.tensor2d([input]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const score = prediction.dataSync()[0];
    return Math.round(score * 100);
  }
}
