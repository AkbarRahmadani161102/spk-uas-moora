import ICaseStudy from './ICaseStudy'
import IScore from './IScore'

export default interface IAlternative {
	_id: string
	id: string
	title: string
	studyCase: ICaseStudy
	score: [IScore]
}
