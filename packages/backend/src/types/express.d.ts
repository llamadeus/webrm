import type { Terminal, User } from "~/models";


declare global {
  namespace Express {
    interface Request {
      user: User | null;
      terminal: Terminal | null;
    }
  }
}
