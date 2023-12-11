import { model, Schema, Types } from 'mongoose'
import IScore from '../../../lib/interfaces/IScore'
const ScoreSchema = new Schema<IScore>({
	id: String,
	alternative: { type: Types.ObjectId, ref: 'Alternative' },
	criteria: { type: Types.ObjectId, ref: 'Criteria' },
	score: Number
})

export default model('Score', ScoreSchema)
