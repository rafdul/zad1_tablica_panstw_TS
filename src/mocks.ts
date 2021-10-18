import { MS_IN_6DAYS } from './config'
import { TabWithStates } from './types';


const timeNow: number = (new Date).getTime();

interface Values {
    states0: Array<TabWithStates>,
    states1: Array<TabWithStates>,
    states2: Array<TabWithStates>,
    states3: Array<TabWithStates>,
    states4: Array<TabWithStates>,
    statesWithDensity: Array<TabWithStates>,
    statesWithPopulation: Array<TabWithStates>,
    statesForNewObj: Array<TabWithStates>,
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
    states0: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000, regionalBlocs: [{acronym: 'xx'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'xx'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'xx'}]}],
    states1: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states2: [{id: 1, alpha3Code: 'MON', name: 'Monaco', population: 800000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'SAN', name: 'San Marino', population: 49000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 4, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states3: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000, regionalBlocs: [{acronym: 'XX'}]}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000, regionalBlocs: [{acronym: 'XX'}]}],
    states4: [{name: 'Burkina', population: 9000000, area: 67540, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Surinam', population: 880000, area: 6754, regionalBlocs: [{acronym: 'XX'}]}, {name: 'Malta', population: 213000, area: 645, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Poland', population: 33000000, area: 450000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Greece', population: 8000000, area: 187000, regionalBlocs: [{acronym: 'EU'}]}, {name: 'Belgium', population: 11000000, area: 120000, regionalBlocs: [{acronym: 'EU'}]}],
    statesWithDensity: [{name: "Netherlands", population: 17441139, area: 41850, density: 416.75, regionalBlocs: [{acronym: 'EU'}]}, {name: "Poland", population: 37950802, area: 312679, density: 121.37, regionalBlocs: [{acronym: 'EU'}]}, {name: "Czech Republic", population: 10698896, area: 78865, density: 135.66, regionalBlocs: [{acronym: 'EU'}]}, {name: "Sweden", population: 10353442, area: 450295, density: 22.99, regionalBlocs: [{acronym: 'EU'}]}],
    statesWithPopulation: [{name: "Netherlands", population: 17441139, area: 41850, density: 416.75, regionalBlocs: [{acronym: 'EU'}]}, {name: "Czech Republic", population: 10698896, area: 78865, density: 135.66, regionalBlocs: [{acronym: 'EU'}]}, {name: "China", population: 1370950802, area: 312679, density: 121.37, regionalBlocs: [{acronym: 'EU'}]},{name: "Sweden", population: 10353442, area: 450295, density: 22.99, regionalBlocs: [{acronym: 'EU'}]}],
    statesForNewObj: [
        {name: "Netherlands", alpha3Code: 'NET', nativeName: 'netherlandsssss', languages:[{iso639_1: 'nl', iso639_2: 'nld', name: 'Dutch', nativeName: 'Nederlands'}], currencies: [{code: 'EUR', name: 'Euro', symbol: '€'}], population: 17441139, area: 41850, regionalBlocs: [{acronym: 'EU'}]},
        {name: "Czech Republic", alpha3Code: 'CZR', nativeName: 'czechsssss', languages:[{iso639_1: 'cs', iso639_2: 'ces', name: 'Czech', nativeName: 'cestina'}], currencies: [{code: 'CZK', name: 'Czech koruna', symbol: 'Kč'}], population: 10698896, area: 78865, regionalBlocs: [{acronym: 'EU'}]},
        {name: "Spain", alpha3Code: 'SPA', nativeName: 'spainsssss', languages:[{iso639_1: 'es', iso639_2: 'esp', name: 'Spanish', nativeName: 'Espaniol'}], currencies: [{code: 'EUR', name: 'Euro', symbol: '€'}], population: 41442339, area: 379850, regionalBlocs: [{acronym: 'EU'}]},
        {name: "Iran", alpha3Code: 'IRN', nativeName: 'iransssss', languages:[{iso639_1: 'fa', iso639_2: 'fas', name: 'Persian (Farsi)', nativeName: 'فارسی'}, {iso639_1: 'ar', iso639_2: 'ara', name: 'Arab', nativeName: 'arabish'}], currencies: [{code: 'IRR', name: 'Iranian rial', symbol: '﷼'}], population: 44698896, area: 48865, regionalBlocs: [{acronym: 'AU'}]},
        {name: "Canada", alpha3Code: 'CAN', nativeName: 'kanadassssss', languages:[{iso639_1: 'en', iso639_2: 'eng', name: 'English', nativeName: 'English'}, {iso639_1: 'fr', iso639_2: 'fra', name: 'French', nativeName: 'français'}], currencies: [{code: 'CAD', name: 'Canadian dollar', symbol: '$'}], population: 37623139, area: 105850, regionalBlocs: [{acronym: 'NAFTA'}]},
        {name: "Mexico", alpha3Code: 'MEX', nativeName: 'meksyksssss', languages:[{iso639_1: 'fr', iso639_2: 'fra', name: 'French', nativeName: 'francais'}, {iso639_1: 'es', iso639_2: 'spa', name: 'Spanish', nativeName: 'Español'}], currencies: [{code: 'MXN', name: 'Mexican peso', symbol: '$'}], population: 94698896, area: 99865, regionalBlocs: [{acronym: 'NAFTA'}]},
        {name: "China", alpha3Code: 'CHI', nativeName: 'chinasssss', languages:[{iso639_1: 'zh', iso639_2: 'zho', name: 'Chinese', nativeName: '中文 (Zhōngwén)'}], currencies: [{code: 'CNY', name: 'Chinese yuan', symbol: '¥'}], population: 1123698896, area: 206865, regionalBlocs: [{acronym: 'ASEAN'}]},
        {name: "Peru", alpha3Code: 'PER', nativeName: 'perussssss', languages:[{iso639_1: 'es', iso639_2: 'spa', name: 'Spanish', nativeName: 'Español'}], currencies: [{code: 'CNY', name: 'Chinese yuan', symbol: '¥'}], population: 29562321, area: 88865},
    ],
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