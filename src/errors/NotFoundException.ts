import { ExpressError } from './ExpressError';

export class NotFoundException extends ExpressError {
  constructor(message: string = 'not_found') {
    super(404, message);
  }
}
