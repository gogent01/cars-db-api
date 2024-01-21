import { ExpressError } from './ExpressError';

export class AuthorizationException extends ExpressError {
  constructor(message: string = 'authorization_failure') {
    super(401, message);
  }
}
