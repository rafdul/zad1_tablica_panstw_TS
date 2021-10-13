import { TabWithStates, tabRegBloc, RegBlocs } from './config'

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
                        addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1, singleLanguage.nativeName, true)
                    } else if (languagesObj != undefined) {
                        createObjLanguage(nameBlock, singleLanguage.iso639_1);
                        addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1, singleLanguage.nativeName)
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
    const addDataToObjLanguage = (referenceToObj: any, country: TabWithStates, codeLang: string, nativeNameLang: string, langExist: boolean = false) => {
        if(referenceToObj != undefined) {
            if(country.alpha3Code) referenceToObj[codeLang].countries.push(country.alpha3Code);
            if(country.population) referenceToObj[codeLang].population += country.population;
            if(country.area) referenceToObj[codeLang].area += country.area;      
            if(langExist) {
                // if(country.nativeName) referenceToObj[codeLang].name += `, ${nativeNameLang}`;
            } else {
                if(country.nativeName) referenceToObj[codeLang].name += nativeNameLang;
            }
        }
    }

    // funkcja zbierająca funkcje "cząstkowe", które budują poszczególne części nowego obiektu
    const makeObjWithRegBlocs = () => {
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
        console.log('Bloki reguonalne: ', regionalBlocs);
    }

    // kolejnosć wywoływania funkcji
    getRegionalArray(dataFromApi);
    makeObjWithRegBlocs()
    showConsole();

    return regionalBlocs;
}
