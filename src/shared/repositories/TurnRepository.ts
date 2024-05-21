import {DBSettings, TurnDetails} from '../Types';
import {v4 as uuidv4} from 'uuid';
import mongoose, {Model} from 'mongoose';
import {ITurnModel, turnSchema} from '../models/Turn';

export class TurnRepository {
  constructor() {
    mongoose.set('strictQuery', false);
    this.model = mongoose.model<ITurnModel>('Turn', turnSchema);
  }
  private model: Model<ITurnModel>

  public async connect(dbSettings: DBSettings) {
    const uri: string = `mongodb+srv://${dbSettings.dbUser}:${dbSettings.dbPassword}@${dbSettings.dbServer}`;
    try {
      await mongoose.connect(uri, {dbName: 'turns'});
    } catch (e) {
      console.error(e);
    }

    console.log('connected to MongoDB');
  }

  public async addTurn(turn: TurnDetails): Promise<TurnDetails> {
    const newTurn = await this.model.create(turn);
    console.log(`Turn ${newTurn.turn} created`);

    return newTurn.toObject();
  }

  public async getTurn(turnId: string): Promise<TurnDetails> {
    const turn = await this.model.findOne({ turn_id: turnId });
    if (!turn) {
      console.log('Turn not found');
    }
    return turn!.toObject();
  }

  public async assignTurn(turnId: string, name: string): Promise<TurnDetails> {
    const turn = await this.model.findOneAndUpdate(
        {turn_id: turnId},
        {
          $set: {user_name: name, assigned: true}
        },
        {
          new: true,
          upsert: false,
        }
    );
    return turn!.toObject();
  }

  public async getNextAvailableTurn(): Promise<TurnDetails> {
    const unassignedTurn = await this.model.findOne({ assigned: false });
    if (!unassignedTurn) {
      return await this.addTurn({
        turn_id: uuidv4(),
        turn: 1,
        user_name: '',
        assigned: false,
      });
    } else {
      return unassignedTurn.toObject();
    }
  }

  public async resetTurns(): Promise<void> {
    await this.model.deleteMany({});
  }
}
