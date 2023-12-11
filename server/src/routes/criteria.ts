import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import ICriteria, { CriteriaType } from "../../../lib/interfaces/ICriteria"
import Criteria from "../models/Criteria"

module.exports = function (fastify: FastifyInstance, opts: any, done: any) {

    fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
        const { caseStudy_id, title, weight, type } = req.body as { caseStudy_id: string, title: string, weight: number, type: CriteriaType }
        return await Criteria.create({ studyCase: caseStudy_id, title, weight, type })
    })

    fastify.put('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        const { title, weight, type } = req.body as ICriteria
        return await Criteria.findByIdAndUpdate(_id, { title, weight, type })
    })

    fastify.patch('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        const { score } = req.body as { score: string }
        return await Criteria.findByIdAndUpdate(_id, { score })
    })

    fastify.delete('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        await Criteria.findOneAndDelete({ _id })
    })

    done()
}
