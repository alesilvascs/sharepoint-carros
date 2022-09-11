
import { SPHttpClient } from "@microsoft/sp-http";

export interface WebpartProps { 
   spHttpClient: SPHttpClient;
}
export interface ICadastroCarrosProps {
  description: string;
  context: any;
}
