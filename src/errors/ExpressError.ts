interface ErrorResponseBody {
  path: string;
  timestamp: number;
  message: string;
}

export class ExpressError {
  readonly status: number;
  readonly message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  toResponseBody(originalUrl: string): ErrorResponseBody {
    return {
      path: originalUrl,
      timestamp: new Date().getTime(),
      message: this.message,
    };
  }
}
