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
        EU: { countries: [], population: 0, languages: {}, currencies: [] },
        NAFTA: { countries: [], population: 0, languages: {}, currencies: [] },
        AU: { countries: [], population: 0, languages: {}, currencies: [] },
        other: { countries: [], population: 0, languages: {}, currencies: [] },
    };

    const euBlock: Array<TabWithStates> = [];
    const auBlock: Array<TabWithStates> = [];
    const naftaBlock: Array<TabWithStates> = [];
    const otherBlock: Array<TabWithStates> = [];

    // tworzy zmienne z tablicami państw z danego bloku
    const getRegionalArray = (data: Array<TabWithStates>) => {
        data.forEach(el => {
            if(el.regionalBlocs) {
                if(el.regionalBlocs.find(i => i.acronym === 'EU')) {
                    euBlock.push(el);
                }
                else if(el.regionalBlocs.find(i => i.acronym === 'AU')) {
                    auBlock.push(el);
                }
                else if(el.regionalBlocs.find(i => i.acronym === 'NAFTA')) {
                    naftaBlock.push(el);
                } 
                else {
                    otherBlock.push(el);
                }
            } else {
                otherBlock.push(el);
            }
        })
    }

    // wyciągnięcie nativeName państw
    const getNativeName = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other') => {
        stateInRegionalBloc.forEach(el => {
            if(el.nativeName != undefined) {
                switch(nameBlock) {
                    case 'EU':
                        regionalBlocs.EU.countries.sort().push(el.nativeName);
                        break;
                    case 'AU' :
                        regionalBlocs.AU.countries.sort().push(el.nativeName);
                        break;
                    case 'NAFTA':
                        regionalBlocs.NAFTA.countries.sort().push(el.nativeName);
                        break;
                    case 'other':
                        regionalBlocs.other.countries.sort().push(el.nativeName);
                        break;
                    default:
                        console.log('Błędny argument nameBlock.');
                }
            } else {
                throw Error('W tablicy są państwa, które nie mają nativeName.');
            }
        })
    }

    const startGetNativeName = () => {
        getNativeName(euBlock, 'EU');
        getNativeName(auBlock, 'AU');
        getNativeName(naftaBlock, 'NAFTA');
        getNativeName(otherBlock, 'other');
    }

    // wyciąganie currencies państw
    const getCurrencies = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other') => {
        stateInRegionalBloc.forEach(el => {
            if(Array.isArray(el.currencies)) {
                el.currencies.forEach(item => {
                    switch(nameBlock) {
                        case 'EU':
                            if(!regionalBlocs.EU.currencies.includes(item.code)) regionalBlocs.EU.currencies.push(item.code);
                            break;
                        case 'AU' :
                            if(!regionalBlocs.AU.currencies.includes(item.code)) regionalBlocs.AU.currencies.push(item.code);
                            break;
                        case 'NAFTA':
                            if(!regionalBlocs.NAFTA.currencies.includes(item.code)) regionalBlocs.NAFTA.currencies.push(item.code);
                            break;
                        case 'other':
                            if(!regionalBlocs.other.currencies.includes(item.code)) regionalBlocs.other.currencies.push(item.code);
                            break;
                        default:
                            console.log('Błędny argument nameBlock.');
                    }
                })
            } else {
                console.log(`${el.name} nie posiada we właściwościach tablicy walut`);
            }
        });
    }

    const startGetCurrencies = () => {
        getCurrencies(euBlock, 'EU');
        getCurrencies(auBlock, 'AU');
        getCurrencies(naftaBlock, 'NAFTA');
        getCurrencies(otherBlock, 'other');
    }

    // dodawanie populacji państw
    const getSumPopulation = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other') => {
        stateInRegionalBloc.forEach(el => {
            if(typeof el.population === 'number') {
                switch(nameBlock) {
                    case 'EU':
                        regionalBlocs.EU.population += el.population;
                        break;
                    case 'AU' :
                        regionalBlocs.AU.population += el.population;
                        break;
                    case 'NAFTA':
                        regionalBlocs.NAFTA.population += el.population;
                        break;
                    case 'other':
                        regionalBlocs.other.population += el.population;
                        break;
                    default:
                        console.log('Błędny argument nameBlock.');
                }
            }
        });
    }

    const startGetSumPopulation = () => {
        getSumPopulation(euBlock, 'EU');
        getSumPopulation(auBlock, 'AU');
        getSumPopulation(naftaBlock, 'NAFTA');
        getSumPopulation(otherBlock, 'other');
    }

    
    // kolejnosć wywoływania funkcji
    getRegionalArray(dataFromApi);
    startGetNativeName();
    startGetCurrencies();
    startGetSumPopulation();

    const showConsole = () => {
        console.log('tablice z blokami :', [euBlock, auBlock, naftaBlock, otherBlock]);
        console.log('Nowy obiekt z nativeName: ', regionalBlocs);
    }
    showConsole();

    // getNameCountries(dataFromApi);
    return regionalBlocs;
}
