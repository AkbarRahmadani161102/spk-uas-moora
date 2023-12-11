import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import CaseStudy from "../models/CaseStudy"

module.exports = function (fastify: FastifyInstance, opts: any, done: any) {
    fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
        return await CaseStudy.find({}, { title: 1 })
    })

    fastify.get('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        return await CaseStudy.findById(_id).populate([
            {
                path: 'alternative',
                model: 'Alternative',
                populate: {
                    path: 'score',
                    model: 'Score',
                    populate: {
                        path: 'criteria',
                        model: 'Criteria'
                    }
                },
            },
            {
                path: 'criteria',
                model: 'Criteria'
            },
        ])
    })

    fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
        const { title, description } = req.body as { title: string, description: string }
        return await CaseStudy.create({ title, description })
    })

    fastify.put('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }

        const { title, description } = req.body as { title: string, description: string }
        return await CaseStudy.findByIdAndUpdate(_id, { title, description })
    })

    fastify.delete('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        return await CaseStudy.findOneAndDelete({ _id })
    })

    done()
}
