import {turn} from '../Types';
import { v4 as uuidv4 } from 'uuid';

export class TurnService {
  constructor() {
    this.createNextTurn();
  }

  public turns: turn = {};
  public currentTurn: number = 0;
  public nextAvailableTurn: string = '';

  public assignTurn(id: string, userName: string): number {
    if (!this.turns[id].assigned) {
      this.turns[id].user_name = userName;
      this.turns[id].assigned = true;
      this.createNextTurn();
    }

    return this.turns[id].turn;
  }

  public createNextTurn() {
    this.currentTurn++;
    this.nextAvailableTurn = uuidv4();

    this.turns[this.nextAvailableTurn] = {
      turn: this.currentTurn,
      user_name: '',
      assigned: false,
    };
  }

}
