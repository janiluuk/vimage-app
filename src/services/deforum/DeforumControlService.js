import requestService from '@/services/request-service/ApiRequestService'

const DeforumControlService = {
  sendLiveUpdate(payload) {
    return requestService.post('/deforum/live', payload)
  },
  getLiveStatus() {
    return requestService.get('/deforum/live/status')
  }
}

export default DeforumControlService
