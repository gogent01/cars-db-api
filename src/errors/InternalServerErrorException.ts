import { ExpressError } from './ExpressError';

export class InternalServerErrorException extends ExpressError {
  constructor(message: string = 'internal_server_error') {
    super(500, message);
  }
}
