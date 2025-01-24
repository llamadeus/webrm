import "express-session";
import type { Auth } from "webrm-shared";


declare module "express-session" {
  interface SessionData {
    auth?: Auth | undefined;
  }
}
