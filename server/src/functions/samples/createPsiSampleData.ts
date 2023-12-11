import Alternative from "../../models/Alternative";
import CaseStudy from "../../models/CaseStudy";
import Criteria from "../../models/Criteria";
import Score from "../../models/Score";

const CASE_STUDY_NAME_PSI = 'Mobil'

export default async function createPsiSampleData() {
    const isPsiSampleExist = await CaseStudy.findOne({ title: CASE_STUDY_NAME_PSI })
    if (isPsiSampleExist) {
        await CaseStudy.findOneAndDelete({ title: CASE_STUDY_NAME_PSI })
    }

    const samplePsiCaseStudy = await CaseStudy.create({ title: CASE_STUDY_NAME_PSI })

    const samplePsiCriteria = await Criteria.create([
        {
            title: 'C1',
            studyCase: samplePsiCaseStudy,
            type: 'Benefit',
            weight: 0
        },
        {
            title: 'C2',
            studyCase: samplePsiCaseStudy,
            type: 'Benefit',
            weight: 0
        },
        {
            title: 'C3',
            studyCase: samplePsiCaseStudy,
            type: 'Benefit',
            weight: 0
        },
        {
            title: 'C4',
            studyCase: samplePsiCaseStudy,
            type: 'Cost',
            weight: 0
        },
        {
            title: 'C5',
            studyCase: samplePsiCaseStudy,
            type: 'Cost',
            weight: 0
        }
    ])

    const samplePsiAlternative = await Alternative.create([
        {
            title: 'A1',
            studyCase: samplePsiCaseStudy
        },
        {
            title: 'A2',
            studyCase: samplePsiCaseStudy
        },
        {
            title: 'A3',
            studyCase: samplePsiCaseStudy
        },
        {
            title: 'A4',
            studyCase: samplePsiCaseStudy
        },
        {
            title: 'A5',
            studyCase: samplePsiCaseStudy
        },
    ])

    const samplePsiScoreAlt1 = await Score.create([
        // Row 1
        {
            alternative: samplePsiAlternative[0],
            criteria: samplePsiCriteria[0],
            score: .5
        },
        {
            alternative: samplePsiAlternative[0],
            criteria: samplePsiCriteria[1],
            score: 1
        },
        {
            alternative: samplePsiAlternative[0],
            criteria: samplePsiCriteria[2],
            score: .7
        },
        {
            alternative: samplePsiAlternative[0],
            criteria: samplePsiCriteria[3],
            score: .7
        },
        {
            alternative: samplePsiAlternative[0],
            criteria: samplePsiCriteria[4],
            score: .8
        },
    ])

    const samplePsiScoreAlt2 = await Score.create([
        // Row 2
        {
            alternative: samplePsiAlternative[1],
            criteria: samplePsiCriteria[0],
            score: .8
        },
        {
            alternative: samplePsiAlternative[1],
            criteria: samplePsiCriteria[1],
            score: .7
        },
        {
            alternative: samplePsiAlternative[1],
            criteria: samplePsiCriteria[2],
            score: 1
        },
        {
            alternative: samplePsiAlternative[1],
            criteria: samplePsiCriteria[3],
            score: .5
        },
        {
            alternative: samplePsiAlternative[1],
            criteria: samplePsiCriteria[4],
            score: 1
        },
    ])

    const samplePsiScoreAlt3 = await Score.create([
        // Row 3
        {
            alternative: samplePsiAlternative[2],
            criteria: samplePsiCriteria[0],
            score: 1
        },
        {
            alternative: samplePsiAlternative[2],
            criteria: samplePsiCriteria[1],
            score: .3
        },
        {
            alternative: samplePsiAlternative[2],
            criteria: samplePsiCriteria[2],
            score: .4
        },
        {
            alternative: samplePsiAlternative[2],
            criteria: samplePsiCriteria[3],
            score: .7
        },
        {
            alternative: samplePsiAlternative[2],
            criteria: samplePsiCriteria[4],
            score: 1
        },
    ])

    const samplePsiScoreAlt4 = await Score.create([
        // Row 4
        {
            alternative: samplePsiAlternative[3],
            criteria: samplePsiCriteria[0],
            score: .2
        },
        {
            alternative: samplePsiAlternative[3],
            criteria: samplePsiCriteria[1],
            score: 1
        },
        {
            alternative: samplePsiAlternative[3],
            criteria: samplePsiCriteria[2],
            score: .5
        },
        {
            alternative: samplePsiAlternative[3],
            criteria: samplePsiCriteria[3],
            score: .9
        },
        {
            alternative: samplePsiAlternative[3],
            criteria: samplePsiCriteria[4],
            score: .7
        },
    ])

    const samplePsiScoreAlt5 = await Score.create([
        // Row 5
        {
            alternative: samplePsiAlternative[4],
            criteria: samplePsiCriteria[0],
            score: 1
        },
        {
            alternative: samplePsiAlternative[4],
            criteria: samplePsiCriteria[1],
            score: .7
        },
        {
            alternative: samplePsiAlternative[4],
            criteria: samplePsiCriteria[2],
            score: .4
        },
        {
            alternative: samplePsiAlternative[4],
            criteria: samplePsiCriteria[3],
            score: .7
        },
        {
            alternative: samplePsiAlternative[4],
            criteria: samplePsiCriteria[4],
            score: 1
        },
    ])

    // console.log('CASE STUDY \n' + sampleCaseStudy)
    await CaseStudy.findByIdAndUpdate(samplePsiCaseStudy._id, { alternative: samplePsiAlternative, criteria: samplePsiCriteria })
    await Alternative.findByIdAndUpdate(samplePsiAlternative[0]._id, { score: samplePsiScoreAlt1 })
    await Alternative.findByIdAndUpdate(samplePsiAlternative[1]._id, { score: samplePsiScoreAlt2 })
    await Alternative.findByIdAndUpdate(samplePsiAlternative[2]._id, { score: samplePsiScoreAlt3 })
    await Alternative.findByIdAndUpdate(samplePsiAlternative[3]._id, { score: samplePsiScoreAlt4 })
    await Alternative.findByIdAndUpdate(samplePsiAlternative[4]._id, { score: samplePsiScoreAlt5 })
    return 'Created PSI Sample Data'
}