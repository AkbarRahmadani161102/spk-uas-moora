import createPsiSampleData from "./samples/createPsiSampleData"
import createTopsisSampleData from "./samples/createTopsisSampleData"

export default async function createSampleData() {
    await Promise.all([
        [createPsiSampleData(), createTopsisSampleData()]
    ])

    return 'Sample Created'
}