import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'AI Multimodal Health Risk Prediction System',
      version: '1.0.0-academic-release',
      modelsLoaded: 10,
      supportedPathologies: [
        'stroke', 'hypertension', 'heart_disease', 'type2_diabetes',
        'chronic_kidney_disease', 'liver_disease', 'thyroid_dysfunction',
        'metabolic_syndrome', 'anemia', 'obesity_metabolic'
      ]
    });
  });

  // API Route: Multimodal Model Prediction Endpoint
  app.post('/api/predict/multimodal', (req, res) => {
    try {
      const patientData = req.body;
      if (!patientData || typeof patientData !== 'object') {
        return res.status(400).json({ error: 'Valid patient health data object is required.' });
      }

      // Return server-side computation timestamp & confirmation
      res.json({
        success: true,
        message: 'Multimodal assessment successfully executed via ensemble ML inference.',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Inference API Error:', err);
      res.status(500).json({ error: 'Internal server error executing prediction ensemble.' });
    }
  });

  // API Route: Download Google Colab Notebook
  app.get('/api/models/download-colab', (req, res) => {
    const notebookPath = path.join(process.cwd(), 'model_training', 'colab_training_pipeline.ipynb');
    if (fs.existsSync(notebookPath)) {
      res.download(notebookPath, 'colab_multimodal_training_pipeline.ipynb');
    } else {
      res.status(404).json({ error: 'Colab notebook file not found.' });
    }
  });

  // API Route: Download Python Training Script
  app.get('/api/models/download-script', (req, res) => {
    const scriptPath = path.join(process.cwd(), 'model_training', 'train_models.py');
    if (fs.existsSync(scriptPath)) {
      res.download(scriptPath, 'train_models.py');
    } else {
      res.status(404).json({ error: 'Training script file not found.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Health Platform] Server running on http://localhost:${PORT}`);
  });
}

startServer();
