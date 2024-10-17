const STATUS_MESSAGES = {
  200: 'success',
  201: 'success',
  204: 'success',
  400: 'fail',
  401: 'fail',
  403: 'fail',
  404: 'fail',
  409: 'fail',
  422: 'fail',
  500: 'error'
}

const getStatusMessage = (statusCode) => {
  return STATUS_MESSAGES[statusCode] || 'unknown'
}

export function sendDataResponse(res, statusCode, payload) {
  return res.status(statusCode).json({
    status: getStatusMessage(statusCode),
    data: payload
  })
}

export function sendMessageResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    status: getStatusMessage(statusCode),
    message
  })
}

export function sendErrorResponse(res, statusCode, error) {
  return res.status(statusCode).json({
    status: getStatusMessage(statusCode),
    error: error || 'An unexpected error occurred'
  })
}

export function sendComplexResponse(res, statusCode, message, data) {
  return res.status(statusCode).json({
    status: getStatusMessage(statusCode),
    message,
    data
  })
}
