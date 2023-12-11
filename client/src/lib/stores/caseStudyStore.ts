import { writable, type Writable } from 'svelte/store';
import type ICaseStudy from '../../../../lib/interfaces/ICaseStudy';
import { baseUrlStore } from './baseUrlStore';
export const caseStudyStore: Writable<ICaseStudy[]> = writable();
export const selectedCaseStudy: Writable<ICaseStudy> = writable();
export const activeCaseStudy: Writable<ICaseStudy> = writable();

let api: string
baseUrlStore.subscribe((v) => api = v)

let currentCaseStudy: ICaseStudy
selectedCaseStudy.subscribe(async (caseStudy) => {
	console.log('changed', caseStudy)
	if (caseStudy && caseStudy._id) {
		const response = await getCaseStudy(caseStudy._id)
		activeCaseStudy.set(response)
	}

	currentCaseStudy = caseStudy
})

export const getCaseStudyList = async () => {
	const response = await fetch(`${api}/case-study/`).then(res => res.json()).catch(err => console.log(err))
	caseStudyStore.set(response)
	return response
};

export const getCaseStudy = async (_id: string) => {
	const response = await fetch(`${api}/case-study/${_id}`).then(res => res.json()).catch(err => console.log(err))
	return response
}

export const refreshData = async () => {
	const response = await fetch(`${api}/case-study/${currentCaseStudy._id}`).then(res => res.json()).catch(err => console.log(err))
	activeCaseStudy.set(response);
}