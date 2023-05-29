export enum ErrorTypes {
    // 400 Bad Request
    INVALID_REQUEST_ERROR = 'INVALID_REQUEST_ERROR',
    // 401 Unauthorized
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    NO_PERMISSION_ERROR = 'NO_PERMISSION_ERROR',
    // 403 Forbidden
    FORBIDDEN = 'FORBIDDEN',
    // 404
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    VALIDATOR_DOES_NOT_EXISTS = 'VALIDATOR_DOES_NOT_EXISTS',
    // 408
    TIMEOUT = 'TIMEOUT',
    // 429 Too Many Requests
    RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
    // 500 Internal Server Error
    API_ERROR = 'API_ERROR',
    // 503 Service Unavailable
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    LCD_ERROR = 'LCD_ERROR'
  }
  
  export enum ErrorCodes {
    // 400 Bad Request
    INVALID_REQUEST_ERROR = 400,
    // 401 Unauthorized
    AUTHENTICATION_ERROR = 401,
    // 403 Forbidden
    FORBIDDEN = 403,
    // 404
    NOT_FOUND_ERROR = 404,
    // 408
    TIMEOUT = 408,
    // 429 Too Many Requests
    RATE_LIMIT_ERROR = 429,
    // 500 Internal Server Error
    API_ERROR = 500,
    // 503 Service Unavailable
    SERVICE_UNAVAILABLE = 503
  }
  
  // error message
  const errorMessage: any = {}
  
  export class APIError extends Error {
    public type: string
    public message: string
    public code: string
    public wrappedError?: Error
  
    constructor(type: ErrorTypes, code = '', message = '', err?: Error) {
      super(message)
      this.name = 'APIError'
      this.type = type || ErrorTypes.API_ERROR
      this.code = code
      this.message = message || errorMessage[code]
      this.wrappedError = err
    }
  }
  