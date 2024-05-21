import {TurnDetails} from '../Types';
import {TurnRepository} from '../repositories/TurnRepository';

export class TurnService {
  constructor(_repository: TurnRepository) {
    this.repository = _repository;
  }
  private repository: TurnRepository;

  public currentTurn: number = 0;
  public nextAvailableTurn: string = '';

  public async assignTurn(turnId: string, userName: string): Promise<TurnDetails> {
    return await this.repository.assignTurn(turnId, userName);
  }

  public async reserveTurn(turnId: string): Promise<void> {
    await this.repository.reserveTurn(turnId);
  }

  public async createNextTurn(): Promise<TurnDetails> {
    const nextTurn = await this.repository.getNextAvailableTurn();
    this.currentTurn = nextTurn.turn;
    this.nextAvailableTurn = nextTurn.turn_id!;

    return nextTurn;
  }

  public async resetDB() {
    await this.repository.resetTurns();
  }
}
