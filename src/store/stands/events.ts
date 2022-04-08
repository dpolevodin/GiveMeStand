import { domain } from '../domain'

export const getStandsEvent = domain.createEvent<string>()
export const setIsStandsLoadingEvent = domain.createEvent<boolean>()
export const setLocationKeyEvent = domain.createEvent<string>()
export const resetStandsEvent = domain.createEvent()