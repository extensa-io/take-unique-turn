import {MongoClient} from 'mongodb';
import { DBSettings } from '../Types';

export class TurnRepository {
  constructor() {
  }

  public async connect(dbSettings: DBSettings) {
    const uri: string = `mongodb+srv://${dbSettings.dbUser}:${dbSettings.dbPassword}@${dbSettings.dbServer}`;
    const client = new MongoClient(uri);

    await client.connect();

    console.log('connected to MongoDB');
  }
}
