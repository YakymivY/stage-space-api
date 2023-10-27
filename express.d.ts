// Import the express module
import { Request } from 'express';

// Declare the custom property you want to add
declare global {
    namespace Express {
        export interface Request {
          user: {
              email?: string,
              name?: string,
              id?: string,
              role?: string
          };
        }
      }
}
