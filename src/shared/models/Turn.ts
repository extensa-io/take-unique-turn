import mongoose from 'mongoose';
import {TurnDetails, TurnStatus} from '../Types';

export const turnSchema = new mongoose.Schema(
    {
      turn_id: String,
      turn: Number,
      user_name: String,
      status: {
        type: String,
        enum: Object.values(TurnStatus),
      },
    },
    {
      toObject: {transform, flattenMaps: true},
      toJSON: {transform},
      collection: 'turns-node',
      timestamps: true,
      versionKey: false,
    },
);

turnSchema.index({'turn_id': 1}, {name: 'turn_id_index', unique: true, background: true});
turnSchema.index({'turn': 1}, {name: 'turn_index', unique: true, background: true});
turnSchema.index({'status': 1}, {name: 'status_index', background: true});

function transform(doc: any, ret: any) {
  delete ret._id;
  delete ret.createdAt;
  delete ret.updatedAt;
}

export interface ITurnModel extends TurnDetails, mongoose.Document {
}
