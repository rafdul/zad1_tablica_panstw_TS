import {MS_IN_6DAYS} from './config'

const timeNow: number = (new Date).getTime();

export interface TabWithStates {
    name: string,
    population: number,
    area?: number,
    density?: number,
    id?: number,
    alpha3Code?: string,
    regionalBlocs: Array<{acronym: string}>
};

interface Values {
    states0: Array<TabWithStates>,
    states1: Array<TabWithStates>,
    states2: Array<TabWithStates>,
    states3: Array<TabWithStates>,
    states4: Array<TabWithStates>,
    statesWithDensity: Array<TabWithStates>,
    obj: {key: string, res: {}[]},
    arr: {key: string, res: string[]},
    num: {key: string, res: number},
    empty: {key: string, res: null},
    time: {
        dateDownloadMS: number,
        number6Days: number, 
        numberGreaterThan6Days: number, 
        numberLess6Days: number, 
        numberLess6Days_v2: number, 
        numberLess6Days_v3: number, 
        notNumber: null,
    },
}

export const mockValues: Values = {
    states0: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states1: [{id: 1, alpha3Code: 'BEN', name: 'Benin', population: 1000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'RWA', name: 'Rwanda', population: 5500000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'UGA', name: 'Uganda', population: 70000000, regionalBlocs: [{acronym: 'XX'}]}],
    states2: [{id: 1, alpha3Code: 'MON', name: 'Monaco', population: 800000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'SAN', name: 'San Marino', population: 49000, regionalBlocs: [{acronym: 'XX'}]}],
    states3: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states4: [{name: 'Burkina', population: 9000000, area: 67540, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Surinam', population: 880000, area: 6754, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Malta', population: 213000, area: 645, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Poland', population: 33000000, area: 450000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Greece', population: 8000000, area: 187000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Belgium', population: 11000000, area: 120000, regionalBlocs: [{acronym: 'EU'}]}],
    statesWithDensity: [{name: "Netherlands", population: 17441139, area: 41850, density: 416.75, regionalBlocs: [{acronym: 'EU'}]}, {name: "Poland", population: 37950802, area: 312679, density: 121.37, regionalBlocs: [{acronym: 'EU'}]}, {name: "Czech Republic", population: 10698896, area: 78865, density: 135.66, regionalBlocs: [{acronym: 'EU'}]}, {name: "Sweden", population: 10353442, area: 450295, density: 22.99, regionalBlocs: [{acronym: 'EU'}]}],
    obj: {key: 'testObject', res: [{name: 'holandia', surname: 'królestwo', id: 123}, {name: 'gujana', surname: 'republika', id: 321}]},
    arr: {key: 'testArray', res: ['meksyk', 'brazylia', 'argentyna', 'boliwia', 'urugwaj']},
    num: {key: 'testNumber', res: 12345},
    empty: {key: 'testEmpty', res: null},
    time: {
        dateDownloadMS: 1633513106822,
        number6Days: (timeNow - MS_IN_6DAYS), 
        numberGreaterThan6Days: (timeNow - MS_IN_6DAYS - 1), 
        numberLess6Days: (timeNow - 1), 
        numberLess6Days_v2: (timeNow - MS_IN_6DAYS + 1000), 
        numberLess6Days_v3: (timeNow - 1000), 
        notNumber: null,
    },
}