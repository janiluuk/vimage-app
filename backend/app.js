const express = require('express');
const defaultAudioClient = require('./comfyAudioClient');
const defaultQueueManager = require('./queueManager');

function createApp({ audioClient = defaultAudioClient, queueManager = defaultQueueManager } = {}) {
  const app = express();

  app.get('/api/stream', async (req, res) => {
    const { text = '' } = req.query;
    const job = queueManager.enqueue({ text });

    res.setHeader('Content-Type', 'audio/aac');
    res.setHeader('X-Job-Id', job.id);

    try {
      queueManager.markProcessing(job.id);
      await audioClient.generateAndStream(text, res, process.env.COMFY_HOST);
      queueManager.markComplete(job.id);
    } catch (err) {
      console.error(err);
      queueManager.markFailed(job.id, err);
      if (!res.headersSent) {
        res.status(500).end('Error generating audio');
      } else {
        res.end();
      }
    }
  });

  app.get('/api/status', (req, res) => {
    res.json(queueManager.getStatus());
  });

  app.get('/api/queue', (req, res) => {
    res.json(queueManager.getQueue());
  });

  return app;
}

module.exports = { createApp };
