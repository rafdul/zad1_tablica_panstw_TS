const MS_IN_6DAYS: number = 6*24*60*60*1000;
// const MS_IN_6DAYS: number = 30*1000; // zmienić, gdy w index.ts zmienię okres korzystania z local storage
const timeNow: number = (new Date).getTime();

interface TabWithStates {
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
    states4: Array<TabWithStates>
    obj: {key: string, res: {}[]},
    arr: {key: string, res: string[]},
    num: {key: string, res: number},
    empty: {key: string, res: null},
    time: {
        number6Days: number, 
        numberGreaterThan6Days: number, 
        numberLess6Days: number, 
        numberLess6Days2: number, 
        numberLess6Days3: number, 
        notNumber: null,
    },
}

export const mockValues: Values = {
    states0: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states1: [{id: 1, alpha3Code: 'BEN', name: 'Benin', population: 1000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'RWA', name: 'Rwanda', population: 5500000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'UGA', name: 'Uganda', population: 70000000, regionalBlocs: [{acronym: 'XX'}]}],
    states2: [{id: 1, alpha3Code: 'MON', name: 'Monaco', population: 800000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'SAN', name: 'San Marino', population: 49000, regionalBlocs: [{acronym: 'XX'}]}],
    states3: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states4: [{name: 'Burkina', population: 9000000, area: 67540, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Surinam', population: 880000, area: 6754, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Malta', population: 213000, area: 645, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Poland', population: 33000000, area: 450000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Greece', population: 8000000, area: 187000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Belgium', population: 11000000, area: 120000, regionalBlocs: [{acronym: 'EU'}]}],
    obj: {key: 'testObject', res: [{name: 'holandia', surname: 'królestwo', id: 123}, {name: 'gujana', surname: 'republika', id: 321}]},
    arr: {key: 'testArray', res: ['meksyk', 'brazylia', 'argentyna', 'boliwia', 'urugwaj']},
    num: {key: 'testNumber', res: 12345},
    empty: {key: 'testEmpty', res: null},
    time: {
        number6Days: (timeNow - MS_IN_6DAYS), 
        numberGreaterThan6Days: (timeNow - MS_IN_6DAYS - 1), 
        numberLess6Days: (timeNow - 1), 
        numberLess6Days2: (timeNow - MS_IN_6DAYS + 1000), 
        numberLess6Days3: (timeNow - 1000), 
        notNumber: null,
    },
}