export enum MessageType {
  DIRECT = 'DIRECT',
  TURN_URL = 'TURN_URL',
}

export interface TurnDetails {
  turn: number;
  user_name: string;
  assigned: boolean;
}

export interface turn {
  [id: string] : TurnDetails
}
