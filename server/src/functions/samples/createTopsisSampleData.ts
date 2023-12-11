import Alternative from "../../models/Alternative";
import CaseStudy from "../../models/CaseStudy";
import Criteria from "../../models/Criteria";
import Score from "../../models/Score";

const CASE_STUDY_NAME_TOPSIS = 'Jalan Terbaik'

export default async function createTopsisSampleData() {
    const isSampleExist = await CaseStudy.findOne({ title: CASE_STUDY_NAME_TOPSIS })
    if (isSampleExist) {
        await CaseStudy.findOneAndDelete({ title: CASE_STUDY_NAME_TOPSIS })
    }

    const sampleCaseStudy = await CaseStudy.create({ title: CASE_STUDY_NAME_TOPSIS })

    const sampleCriteria = await Criteria.create([
        {
            title: 'Lokasi',
            studyCase: sampleCaseStudy,
            type: 'Benefit',
            weight: 5
        },
        {
            title: 'Luas Tanah (m^2)',
            studyCase: sampleCaseStudy,
            type: 'Benefit',
            weight: 4
        },
        {
            title: 'Harga (jt/m)',
            studyCase: sampleCaseStudy,
            type: 'Cost',
            weight: 4
        },
        {
            title: 'Ukuran',
            studyCase: sampleCaseStudy,
            type: 'Benefit',
            weight: 3
        },
        {
            title: 'Resiko',
            studyCase: sampleCaseStudy,
            type: 'Cost',
            weight: 4
        }
    ])

    const sampleAlternative = await Alternative.create([
        {
            title: 'Jalan A',
            studyCase: sampleCaseStudy
        },
        {
            title: 'Jalan B',
            studyCase: sampleCaseStudy
        },
        {
            title: 'Jalan C',
            studyCase: sampleCaseStudy
        },
    ])

    const sampleScoreAlt1 = await Score.create([
        // Row 1
        {
            alternative: sampleAlternative[0],
            criteria: sampleCriteria[0],
            score: 4
        },
        {
            alternative: sampleAlternative[0],
            criteria: sampleCriteria[1],
            score: 2000
        },
        {
            alternative: sampleAlternative[0],
            criteria: sampleCriteria[2],
            score: 5000
        },
        {
            alternative: sampleAlternative[0],
            criteria: sampleCriteria[3],
            score: 3
        },
        {
            alternative: sampleAlternative[0],
            criteria: sampleCriteria[4],
            score: 1
        },
    ])

    const sampleScoreAlt2 = await Score.create([
        // Row 2
        {
            alternative: sampleAlternative[1],
            criteria: sampleCriteria[0],
            score: 2
        },
        {
            alternative: sampleAlternative[1],
            criteria: sampleCriteria[1],
            score: 5000
        },
        {
            alternative: sampleAlternative[1],
            criteria: sampleCriteria[2],
            score: 2000
        },
        {
            alternative: sampleAlternative[1],
            criteria: sampleCriteria[3],
            score: 4
        },
        {
            alternative: sampleAlternative[1],
            criteria: sampleCriteria[4],
            score: 4
        },
    ])

    const sampleScoreAlt3 = await Score.create([
        // Row 3
        {
            alternative: sampleAlternative[2],
            criteria: sampleCriteria[0],
            score: 3
        },
        {
            alternative: sampleAlternative[2],
            criteria: sampleCriteria[1],
            score: 4000
        },
        {
            alternative: sampleAlternative[2],
            criteria: sampleCriteria[2],
            score: 3000
        },
        {
            alternative: sampleAlternative[2],
            criteria: sampleCriteria[3],
            score: 4
        },
        {
            alternative: sampleAlternative[2],
            criteria: sampleCriteria[4],
            score: 3
        },
    ])

    // console.log('CASE STUDY \n' + sampleCaseStudy)
    await CaseStudy.findByIdAndUpdate(sampleCaseStudy._id, { alternative: sampleAlternative, criteria: sampleCriteria })
    await Alternative.findByIdAndUpdate(sampleAlternative[0]._id, { score: sampleScoreAlt1 })
    await Alternative.findByIdAndUpdate(sampleAlternative[1]._id, { score: sampleScoreAlt2 })
    await Alternative.findByIdAndUpdate(sampleAlternative[2]._id, { score: sampleScoreAlt3 })
    return 'Created Topsis Sample Data'
}