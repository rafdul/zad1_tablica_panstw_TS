import { TabWithStates } from './config'

export const startRegionalbloc = (dataFromApi: Array<TabWithStates>) => {
    console.log('START danych dla bloków regionalnych');

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
                        regionalBlocs.EU.countries.push(el.nativeName);
                        regionalBlocs.EU.countries.sort().reverse();
                        break;
                    case 'AU' :
                        regionalBlocs.AU.countries.push(el.nativeName);
                        regionalBlocs.AU.countries.sort().reverse();
                        break;
                    case 'NAFTA':
                        regionalBlocs.NAFTA.countries.push(el.nativeName);
                        regionalBlocs.NAFTA.countries.sort().reverse();
                        break;
                    case 'other':
                        regionalBlocs.other.countries.push(el.nativeName);
                        regionalBlocs.other.countries.sort().reverse();
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
                console.log(`${el.name} nie posiada informacji o walutach`);
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

    // dodawanie informacji o językach
    const getLanguages = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other') => {
        let stringToObj = makeReferenceToObj(nameBlock);

        stateInRegionalBloc.forEach(singleState => {
            if(Array.isArray(singleState.languages)) {
                singleState.languages.forEach(singleLanguage => {
                    
                    if(stringToObj != undefined && stringToObj[singleLanguage.iso639_1]) {
                        addDataToObjLanguage(nameBlock, singleState, singleLanguage.iso639_1, true);
                    } else if(stringToObj != undefined) {
                        createObjLanguage(nameBlock, singleLanguage.iso639_1);
                        addDataToObjLanguage(nameBlock, singleState, singleLanguage.iso639_1);
                    }

                });
            } else {
                console.log(`${singleState.name} nie posiada informacji o językach`);
            }
        });
    }

    const startGetLanguages = () => {
        getLanguages(euBlock, 'EU');
        getLanguages(auBlock, 'AU');
        getLanguages(naftaBlock, 'NAFTA');
        getLanguages(otherBlock, 'other');
    }

    // generowanie dostępu do obiektu languages w obiektach dla poszczególnych bloków regionalnych
    const makeReferenceToObj = (nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other') => {
        switch(nameBlock) {
            case 'EU':
                return regionalBlocs.EU.languages;
            case 'AU':
                return regionalBlocs.AU.languages;
            case 'NAFTA':
                return regionalBlocs.NAFTA.languages;
            case 'other':
                return regionalBlocs.other.languages;
            default:
                console.log('Błędny argument nameBlock.');
        }
    }

    // tworzenie pustego obiektu w languages (key to kod języka)
    const createObjLanguage = (nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other', codeLang: string) => {
        let stringToObj = makeReferenceToObj(nameBlock);

        if(stringToObj != undefined) {
            stringToObj[codeLang] = {
                countries: [],
                name: '',
                population: 0,
                area: 0
            }
        }
    }

    // dodawanie danych do obiektu danego języka w languages
    const addDataToObjLanguage = (nameBlock: 'EU' | 'AU' | 'NAFTA' | 'other', country: TabWithStates, codeLang: string, langExist: boolean = false) => {
        let stringToObj = makeReferenceToObj(nameBlock);

        if(stringToObj != undefined) {
            if(country.alpha3Code) stringToObj[codeLang].countries.push(country.alpha3Code);
            if(country.population) stringToObj[codeLang].population += country.population;
            if(country.area) stringToObj[codeLang].area += country.area;      
            if(langExist) {
                if(country.nativeName) stringToObj[codeLang].name += `, ${country.nativeName}`;
            } else {
                if(country.nativeName) stringToObj[codeLang].name += country.nativeName;
            }
        }
    }

    


    
    // kolejnosć wywoływania funkcji
    getRegionalArray(dataFromApi);
    startGetNativeName();
    startGetCurrencies();
    startGetSumPopulation();
    startGetLanguages();


    const showConsole = () => {
        console.log('tablice z blokami :', [euBlock, auBlock, naftaBlock, otherBlock]);
        console.log('Nowy obiekt z nativeName: ', regionalBlocs);
    }
    showConsole();

    return regionalBlocs;

    // ==========================================
    // ======== od tego wyszedłem ===============
    // ==========================================

//     const regionalBlocs2: tabRegBloc = {
//         EU: { countries: [], population: 0, languages: {}, currencies: [] },
//         NAFTA: { countries: [], population: 0, languages: {}, currencies: [] },
//         AU: { countries: [], population: 0, languages: {}, currencies: [] },
//         other: { countries: [], population: 0, languages: {}, currencies: [] },
//     };

//     const makeNewObjRegBlocs = (dataFromApi:any) => {
//         dataFromApi.forEach((state: any) => {
//             if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'EU')) {
//                 regionalBlocs2.EU.countries.push(state.nativeName);
//                 regionalBlocs2.EU.countries.sort().reverse();
//                 if(state.currencies) state.currencies.forEach((item:any) => {
//                     if(!regionalBlocs2.EU.currencies.includes(item.code)) regionalBlocs2.EU.currencies.push(item.code)
//                 })
//                 if(typeof state.population === 'number') regionalBlocs2.EU.population += state.population;
//                 if(state.languages) state.languages.forEach((item:any) => {
//                     if(regionalBlocs2.EU.languages && regionalBlocs2.EU.languages[item.iso639_1]) {
//                         regionalBlocs2.EU.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.EU.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.EU.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.EU.languages[item.iso639_1].name += ` ${state.nativeName}`;
//                     } else if(regionalBlocs2.EU.languages) {
//                         regionalBlocs2.EU.languages[item.iso639_1] = {
//                             countries: [],
//                             name: '',
//                             population: 0,
//                             area: 0
//                         };
//                         regionalBlocs2.EU.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.EU.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.EU.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.EU.languages[item.iso639_1].name += state.nativeName;
//                     }
//                 })
//             }
//             else if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'AU')) {
//                 regionalBlocs2.AU.countries.push(state.nativeName);
//                 regionalBlocs2.AU.countries.sort().reverse();
//                 if(state.currencies) state.currencies.forEach((item:any) => {
//                     if(!regionalBlocs2.AU.currencies.includes(item.code)) regionalBlocs2.AU.currencies.push(item.code)
//                 })
//                 if(typeof state.population === 'number') regionalBlocs2.AU.population += state.population;
//                 if(state.languages) state.languages.forEach((item:any) => {
//                     if(regionalBlocs2.AU.languages && regionalBlocs2.AU.languages[item.iso639_1]) {
//                         regionalBlocs2.AU.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.AU.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.AU.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.AU.languages[item.iso639_1].name += ` ${state.nativeName}`;
//                     } else if(regionalBlocs2.AU.languages) {
//                         regionalBlocs2.AU.languages[item.iso639_1] = {
//                             countries: [],
//                             name: '',
//                             population: 0,
//                             area: 0
//                         };
//                         regionalBlocs2.AU.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.AU.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.AU.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.AU.languages[item.iso639_1].name += state.nativeName;
//                     }
//                 })
//             }
//             else if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'NAFTA')) {
//                 regionalBlocs2.NAFTA.countries.push(state.nativeName);
//                 regionalBlocs2.NAFTA.countries.sort().reverse();
//                 if(state.currencies) state.currencies.forEach((item:any) => {
//                     if(!regionalBlocs2.NAFTA.currencies.includes(item.code)) regionalBlocs2.NAFTA.currencies.push(item.code)
//                 })
//                 if(typeof state.population === 'number') regionalBlocs2.NAFTA.population += state.population;
//                 if(state.languages) state.languages.forEach((item:any) => {
//                     if(regionalBlocs2.NAFTA.languages && regionalBlocs2.NAFTA.languages[item.iso639_1]) {
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].name += ` ${state.nativeName}`;
//                     } else if(regionalBlocs2.NAFTA.languages) {
//                         regionalBlocs2.NAFTA.languages[item.iso639_1] = {
//                             countries: [],
//                             name: '',
//                             population: 0,
//                             area: 0
//                         };
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.NAFTA.languages[item.iso639_1].name += state.nativeName;
//                     }
//                 })
//             }
//             else {
//                 regionalBlocs2.other.countries.push(state.nativeName);
//                 regionalBlocs2.other.countries.sort().reverse();
//                 if(state.currencies) state.currencies.forEach((item:any) => {
//                     if(!regionalBlocs2.other.currencies.includes(item.code)) regionalBlocs2.other.currencies.push(item.code)
//                 })
//                 if(typeof state.population === 'number') regionalBlocs2.other.population += state.population;
//                 if(state.languages) state.languages.forEach((item:any) => {
//                     if(regionalBlocs2.other.languages && regionalBlocs2.other.languages[item.iso639_1]) {
//                         regionalBlocs2.other.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.other.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.other.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.other.languages[item.iso639_1].name += ` ${state.nativeName}`;
//                     } else if(regionalBlocs2.other.languages) {
//                         regionalBlocs2.other.languages[item.iso639_1] = {
//                             countries: [],
//                             name: '',
//                             population: 0,
//                             area: 0
//                         };
//                         regionalBlocs2.other.languages[item.iso639_1].countries.push(state.alpha3Code);
//                         regionalBlocs2.other.languages[item.iso639_1].population += state.population;
//                         regionalBlocs2.other.languages[item.iso639_1].area += state.area;
//                         regionalBlocs2.other.languages[item.iso639_1].name += state.nativeName;
//                     }
//                 })
//             }
//         })    
//     }

//     makeNewObjRegBlocs(dataFromApi);
//     console.log(regionalBlocs2)
}
