import { Row, Workbook } from "exceljs"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import IAlternative from "../../../lib/interfaces/IAlternative"
import ICriteria, { CriteriaType } from "../../../lib/interfaces/ICriteria"
import IImportCriteria from "../../../lib/interfaces/IImportCriteria"
import IScore from "../../../lib/interfaces/IScore"
import Alternative from "../models/Alternative"
import CaseStudy from "../models/CaseStudy"
import Criteria from "../models/Criteria"
import Score from "../models/Score"
const ExcelJS = require('exceljs')

const IMPORT_WORKSHEET_NAME = process.env.IMPORT_WORKSHEET_NAME

module.exports = function (fastify: FastifyInstance, opts: any, done: any) {

    fastify.post('/import', async (req: any, reply: FastifyReply) => {
        const file = await req.file()
        const { caseStudyId } = req.query as { caseStudyId: string }
        const workbook: Workbook = new ExcelJS.Workbook();
        await workbook.xlsx.read(file?.file);
        const worksheet = workbook.getWorksheet(IMPORT_WORKSHEET_NAME)

        /**
        * @param row Data row
        * @param startsFrom Data start from
        */
        const getSheetRowData = (row: number, startsFrom: number = 0) => {
            const result: string[] = []
            const sheetData = worksheet!.getRow(row)
            sheetData.eachCell((cell) => result.push(cell.text))

            return result.slice(startsFrom)
        }

        const getCriteriaData = () => {
            const result: IImportCriteria[] = []
            const criterias = getSheetRowData(3, 1)
            const weight = getSheetRowData(4, 1)
            const criteriaTypes = getSheetRowData(5, 1)

            for (let i = 0; i < criterias.length; i++) {
                let type = ''

                if (criteriaTypes[i].toLowerCase() === 'benefit') {
                    type = 'Benefit'
                } else {
                    type = 'Cost'
                }

                result.push({
                    title: criterias[i],
                    studyCaseId: caseStudyId,
                    type: type as CriteriaType,
                    weight: +weight[i]
                })
            }

            return result
        }

        const getAlternativeAndScoreData = () => {
            const alternatives: string[] = []
            const scores: string[][] = []

            worksheet!.eachRow({ includeEmpty: false }, (row: Row, rowNumber: number) => {
                if (rowNumber >= 7) {
                    const scoreSegment: string[] = []
                    row.eachCell((cell, colNumber) => {
                        if (colNumber === 1) {
                            alternatives.push(cell.text)
                        } else {
                            scoreSegment.push(cell.text)
                        }
                    })
                    scores.push(scoreSegment)
                }
            })

            return [alternatives, scores]

        }

        /** Used to send error to client */
        const sendError = (msg: string) => reply.send({ msg, status: 'Error' })

        if (!worksheet) return sendError('Sample worksheet not found')

        const [alternatives, scores] = getAlternativeAndScoreData()
        const criterias = getCriteriaData()

        const createdScore: IScore[][] = []
        const createdAlternative: IAlternative[] = []
        const createdCriteria: ICriteria[] = []

        for (const alternative of alternatives) {
            createdAlternative.push(await Alternative.create({ title: alternative, studyCase: caseStudyId }))
        }

        for (const criteria of criterias) {
            createdCriteria.push(await Criteria.create({ studyCase: caseStudyId, title: criteria.title, weight: criteria.weight, type: criteria.type }))
        }

        for (let i = 0; i < scores.length; i++) {
            const scoreSegment: IScore[] = []
            for (let j = 0; j < scores[i].length; j++) {
                const score = scores[i][j];
                const finalScore = await Score.create({ score, alternative: createdAlternative[i], criteria: createdCriteria[j] })
                scoreSegment.push(finalScore)
            }
            createdScore.push(scoreSegment)
        }

        for (let i = 0; i < createdAlternative.length; i++) {
            await Alternative.findByIdAndUpdate(createdAlternative[i]._id, { $addToSet: { score: createdScore[i] } })
        }

        await CaseStudy.findByIdAndUpdate(caseStudyId, { alternative: createdAlternative, criteria: createdCriteria }, { new: true })

        // console.log(
        //     alternatives,
        //     scores,
        //     criterias,
        //     createdScore,
        //     createdAlternative,
        //     createdCriteria
        // )
        return reply.send({
            msg: 'Data Imported',
            status: 'Success'
        })
    })

    fastify.get('/template', (req: FastifyRequest, res: any) => {
        return res.sendFile('files/TemplateImportData.xlsx')
    })

    done()
}
