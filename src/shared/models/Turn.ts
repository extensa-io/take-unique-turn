import mongoose from 'mongoose';
import {TurnDetails} from '../Types';

export const turnSchema = new mongoose.Schema(
    {
      turn_id: String,
      turn: Number,
      user_name: String,
      assigned: Boolean,
    },
    {
      toObject: {transform, flattenMaps: true},
      toJSON: {transform},
      collection: 'turns-node',
      timestamps: true,
      versionKey: false,
    },
);

turnSchema.index({'turn_id': 1}, {name: 'turn_id_1', unique: true, background: true});
turnSchema.index({'turn': 1}, {name: 'turn_1', unique: true, background: true});
turnSchema.index({'assigned': 1}, {name: 'assigned_1', background: true});

function transform(doc: any, ret: any) {
  delete ret._id;
  delete ret.createdAt;
  delete ret.updatedAt;
}

export interface ITurnModel extends TurnDetails, mongoose.Document {
}
