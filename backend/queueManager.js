const { randomUUID } = require('crypto');

class QueueManager {
  constructor(historyLimit = 25) {
    this.historyLimit = historyLimit;
    this.activeJobs = [];
    this.history = [];
  }

  enqueue(metadata = {}) {
    const job = {
      id: randomUUID(),
      status: 'queued',
      createdAt: new Date().toISOString(),
      metadata,
    };
    this.activeJobs.push(job);
    return job;
  }

  markProcessing(id) {
    const job = this.findJob(id);
    if (!job) return null;
    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    return job;
  }

  markComplete(id) {
    const job = this.removeJob(id);
    if (!job) return null;
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    this.pushToHistory(job);
    return job;
  }

  markFailed(id, error) {
    const job = this.removeJob(id) || this.findJob(id);
    if (!job) return null;
    job.status = 'failed';
    job.completedAt = new Date().toISOString();
    job.error = error?.message || String(error);
    this.pushToHistory(job);
    return job;
  }

  getQueue() {
    const queued = this.activeJobs.filter((job) => job.status === 'queued');
    const processing = this.activeJobs.filter((job) => job.status === 'processing');

    return {
      queued,
      processing,
      history: [...this.history],
    };
  }

  getStatus() {
    const { queued, processing } = this.getQueue();
    return {
      processing: processing[0] || null,
      queued: queued.length,
      recent: this.history.slice(0, 5),
    };
  }

  reset() {
    this.activeJobs = [];
    this.history = [];
  }

  pushToHistory(job) {
    this.history.unshift(job);
    if (this.history.length > this.historyLimit) {
      this.history.length = this.historyLimit;
    }
  }

  findJob(id) {
    return this.activeJobs.find((job) => job.id === id) || null;
  }

  removeJob(id) {
    const index = this.activeJobs.findIndex((job) => job.id === id);
    if (index === -1) return null;
    const [job] = this.activeJobs.splice(index, 1);
    return job;
  }
}

const defaultQueueManager = new QueueManager();

module.exports = defaultQueueManager;
module.exports.QueueManager = QueueManager;
