import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Alternative from "../models/Alternative"

module.exports = function (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
        const { caseStudy_id, title } = req.body as { caseStudy_id: string, title: string }
        return await Alternative.create({ studyCase: caseStudy_id, title })
    })

    fastify.patch('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        const { title } = req.body as { title: string }
        return await Alternative.findByIdAndUpdate(_id, { title })
    })

    fastify.delete('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        return await Alternative.findOneAndDelete({ _id })
    })

    done()
}
