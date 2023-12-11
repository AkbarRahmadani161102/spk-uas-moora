import { model, Query, Schema, Types } from 'mongoose'
import ICriteria, { CriteriaType } from '../../../lib/interfaces/ICriteria'
import CaseStudy from './CaseStudy'

const CriteriaSchema = new Schema<ICriteria>({
	id: String,
	title: String,
	weight: Number,
	type: {
		type: String,
		enum: CriteriaType,
	},
	studyCase: { type: Types.ObjectId, ref: 'StudyCase' }
})

CriteriaSchema.post<Query<ICriteria, ICriteria>>('save', async function (doc) {
	const caseStudy_id = (await doc).studyCase
	await CaseStudy.findOneAndUpdate({ _id: caseStudy_id }, { $addToSet: { criteria: doc } })
})

CriteriaSchema.post<Query<ICriteria, ICriteria>>('findOneAndDelete', async function (doc) {
	const caseStudyId = doc.studyCase
	const criteriaId = doc._id
	await CaseStudy.findByIdAndUpdate(caseStudyId, { $pull: { alternative: criteriaId } })
})

export default model('Criteria', CriteriaSchema)
