import { model, Query, Schema, Types } from 'mongoose'
import IAlternative from '../../../lib/interfaces/IAlternative'
import CaseStudy from './CaseStudy'
import Score from './Score'

const AlternativeSchema = new Schema<IAlternative>({
	id: String,
	title: String,
	studyCase: { type: Types.ObjectId, ref: 'StudyCase' },
	score: [{ type: Types.ObjectId, ref: 'Score' }]
})

AlternativeSchema.post<Query<IAlternative, IAlternative>>('save', async function (doc) {
	const caseStudy_id = (await doc).studyCase
	await CaseStudy.findOneAndUpdate({ _id: caseStudy_id }, { $addToSet: { alternative: doc } })
})

AlternativeSchema.post<Query<IAlternative, IAlternative>>('findOneAndDelete', async function (doc) {
	const scores = doc.score
	// console.log(typeof scores, scores)

	const caseStudyId = doc.studyCase
	const alternativeId = doc._id
	await CaseStudy.findByIdAndUpdate(caseStudyId, { $pull: { alternative: alternativeId } })
	await Score.deleteMany(...scores)
})

AlternativeSchema.post<Query<IAlternative, IAlternative>>('deleteMany', async function (doc) {
	const scores = doc.score
	await Score.deleteMany(scores)
})

export default model('Alternative', AlternativeSchema)
