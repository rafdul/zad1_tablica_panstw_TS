import { TabWithStates, tabRegBloc, RegBlocs } from './config'
import { TableWithStates } from './tableWithStates';


export const startRegionalbloc = (dataFromApi: Array<TabWithStates>) => {
    console.log('START danych dla bloków regionalnych');

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
                if(el.regionalBlocs.find(i => i.acronym === 'AU')) {
                    auBlock.push(el);
                }
                if(el.regionalBlocs.find(i => i.acronym === 'NAFTA')) {
                    naftaBlock.push(el);
                } 
                if(el.regionalBlocs.find(i => (i.acronym != 'EU' && i.acronym != 'AU' && i.acronym != 'NAFTA' ))) {
                    otherBlock.push(el);
                }
            } else {
                otherBlock.push(el);
            }
        })
    }

    // wyciągnięcie nativeName państw
    const getNativeName = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        stateInRegionalBloc.forEach(el => {
            if(el.nativeName != undefined && nameBlock != undefined) {
                regionalBlocs[nameBlock].countries.push(el.nativeName);
                regionalBlocs[nameBlock].countries.sort().reverse();
            } else {
                console.log('W tablicy są państwa, które nie mają nativeName.');
            }
        })
    }

    // wyciąganie currencies państw
    const getCurrencies = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        stateInRegionalBloc.forEach(el => {
            if(Array.isArray(el.currencies)) {
                el.currencies.forEach(item => {
                    if(nameBlock != undefined && !regionalBlocs[nameBlock].currencies.includes(item.code)) 
                        regionalBlocs[nameBlock].currencies.push(item.code);                    
                })
            } else {
                console.log(`${el.name} nie posiada informacji o walutach`);
            }
        });
    }

    // dodawanie populacji państw
    const getSumPopulation = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        stateInRegionalBloc.forEach(el => {
            if(typeof el.population === 'number' && nameBlock != undefined)
                regionalBlocs[nameBlock].population += el.population;                
        });
    }

    // dodawanie informacji o językach
    const getLanguages = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        const languagesObj = regionalBlocs[nameBlock].languages

        stateInRegionalBloc.forEach(singleState => {
            if(Array.isArray(singleState.languages) && nameBlock != undefined) {
                singleState.languages.forEach(singleLanguage => {

                    if(languagesObj != undefined && languagesObj[singleLanguage.iso639_1]) {
                        addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1, true)
                    } else if (languagesObj != undefined) {
                        createObjLanguage(nameBlock, singleLanguage.iso639_1);
                        addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1)
                    }

                });
            } else {
                console.log(`${singleState.name} nie posiada informacji o językach`);
            }
        });
    }

    // tworzenie pustego obiektu w languages (key to kod języka)
    const createObjLanguage = (nameBlock: RegBlocs, codeLang: string) => {
        const referenceToObj = regionalBlocs[nameBlock].languages;

        if(!referenceToObj) {
            console.log(`Nie ma obiektu languages w bloku ${nameBlock}`)
        } else {
            return referenceToObj[codeLang] = {
                countries: [],
                name: '',
                population: 0,
                area: 0
            }
        }
    }

    // dodawanie właściwości do obiektu languages
    const addDataToObjLanguage = (referenceToObj: any, country: TabWithStates, codeLang: string, langExist: boolean = false) => {
        if(referenceToObj != undefined) {
            if(country.alpha3Code) referenceToObj[codeLang].countries.push(country.alpha3Code);
            if(country.population) referenceToObj[codeLang].population += country.population;
            if(country.area) referenceToObj[codeLang].area += country.area;      
            if(langExist) {
                if(country.nativeName) referenceToObj[codeLang].name += `, ${country.nativeName}`;
            } else {
                if(country.nativeName) referenceToObj[codeLang].name += country.nativeName;
            }
        }
    }

    // funkcja zbierająca funkcje "cząstkowe", które budują poszczególne części nowego obiektu
    const makeNewRegBloc = () => {
        const parametersRegBlocs: Array<[Array<TabWithStates>, RegBlocs]> = [
            [euBlock, 'EU'], [auBlock, 'AU'], [naftaBlock, 'NAFTA'], [otherBlock, 'other']
        ];

        parametersRegBlocs.forEach( item => {
            getNativeName(item[0], item[1]);
            getCurrencies(item[0], item[1]);
            getSumPopulation(item[0], item[1]);
            getLanguages(item[0], item[1]);

        })
    }

    // konsolowanie informacji o nowym obiekcie
    const showConsole = () => {
        // console.log('tablice z blokami :', [euBlock, auBlock, naftaBlock, otherBlock]);
        console.log('Nowy obiekt z nativeName: ', regionalBlocs);
    }

    // kolejnosć wywoływania funkcji
    getRegionalArray(dataFromApi);
    makeNewRegBloc()
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
