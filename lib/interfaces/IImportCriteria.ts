import { CriteriaType } from "./ICriteria"

export default interface IImportCriteria {
    title: string,
    studyCaseId: string,
    type: CriteriaType
    weight: number
}