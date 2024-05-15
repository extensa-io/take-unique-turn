export enum MessageType {
  DIRECT = 'DIRECT',
  GET_TURN = 'GET_TURN',
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
