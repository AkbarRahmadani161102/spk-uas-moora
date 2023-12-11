import { model, Query, Schema, Types } from 'mongoose'
import ICaseStudy from '../../../lib/interfaces/ICaseStudy'
import Alternative from './Alternative'
import Criteria from './Criteria'

const CaseStudySchema = new Schema<ICaseStudy>({
	id: String,
	title: String,
	description: String,
	alternative: [{ type: Types.ObjectId, ref: 'Alternative' }],
	criteria: [{ type: Types.ObjectId, ref: 'Criteria' }],
})

CaseStudySchema.post<Query<ICaseStudy, ICaseStudy>>('findOneAndDelete', async function (doc) {
	const _id = doc._id
	await Alternative.deleteMany({ studyCase: _id })
	await Criteria.deleteMany({ studyCase: _id })
})
export default model('StudyCase', CaseStudySchema)

