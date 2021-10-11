import { TabWithStates } from './config'

export const startRegionalbloc = (dataFromApi: Array<TabWithStates>) => {
    console.log('ODPALENIE FUNKCJI tableRegionalBloc ');

    interface RegBlocInfo {
        countries: Array<string>,
        population: number,
        languages?: {
            [key: string]: {
                countries: Array<string>,
                population: number,
                area: number,
                name: string,
            },
        }
        currencies: Array<string>,
    };

    interface tabRegBloc {
        EU: RegBlocInfo,
        NAFTA: RegBlocInfo,
        AU: RegBlocInfo,
        other: RegBlocInfo,
    }

    const regionalBlocs: tabRegBloc = {
        EU: {
            countries: [],
            population: 0,
            languages: {},
            currencies: [],
        },
        NAFTA: {
            countries: [],
            population: 0,
            languages: {},
            currencies: [],
        },
        AU: {
            countries: [],
            population: 0,
            languages: {},
            currencies: [],
        },
        other: {
            countries: [],
            population: 0,
            languages: {},
            currencies: [],
        },
    };

    const getNameCountries = (data: Array<TabWithStates>) => {
        [...data].filter(el => {
            if(el.regionalBlocs && el.nativeName != undefined) {
                if(el.regionalBlocs.find(i => i.acronym === 'EU')) {
                    regionalBlocs.EU.countries.push(el.nativeName);
                }
                else if(el.regionalBlocs.find(i => i.acronym === 'AU')) {
                    regionalBlocs.AU.countries.push(el.nativeName);
                }
                else if(el.regionalBlocs.find(i => i.acronym === 'NAFTA')) {
                    regionalBlocs.NAFTA.countries.push(el.nativeName);
                } 
                else {
                    regionalBlocs.other.countries.push(el.nativeName);
                }
            } else if(el.nativeName != undefined) {
                regionalBlocs.other.countries.push(el.nativeName);
            } else {
                throw Error('W tablicy z API są państwa, które nie przynależą do żadnego regionalBlocs i nie mają nativeName');
            }
        })
        
        console.log('selekcja po EU: ', regionalBlocs)
    }



    getNameCountries(dataFromApi);

}