import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Score from "../models/Score"
import Alternative from "../models/Alternative"
import { Types } from "mongoose"
import Criteria from "../models/Criteria"

module.exports = function (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
        const { score, alternativeId, criteriaId } = req.body as { score: number, alternativeId: Types.ObjectId, criteriaId: Types.ObjectId }
        const newScore = await Score.create({ score, alternative: alternativeId, criteria: criteriaId })
        console.log('New Score = ', newScore)
        await Alternative.findByIdAndUpdate({ _id: alternativeId }, { $addToSet: { score: newScore._id } })
    })
    
    fastify.patch('/:_id', async (req: FastifyRequest, reply: FastifyReply) => {
        const _id = req.params as { _id: string }
        const { score } = req.body as { score: string }
        console.log('updating', score)
        return await Score.findByIdAndUpdate(_id, { score })
    })

    done()
}
