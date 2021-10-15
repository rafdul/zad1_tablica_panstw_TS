import { TabWithStates, tabRegBloc, RegBlocs, LangObj } from './config'
import { compareValue, getLanguages } from './utilsFunctions';

export const makeRegionalBlocs = (dataFromApi: Array<TabWithStates>) => {
    // console.log('START generowania bloków regionalnych');

    const regionalBlocs: tabRegBloc = {
        EU: { countries: [], population: 0, languages: {}, currencies: [], area: 0, density: 0 },
        NAFTA: { countries: [], population: 0, languages: {}, currencies: [], area: 0, density: 0 },
        AU: { countries: [], population: 0, languages: {}, currencies: [], area: 0, density: 0 },
        other: { countries: [], population: 0, languages: {}, currencies: [], area: 0, density: 0 },
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

    // dodawanie populacji państw w ramach bloków
    const getSumPopulation = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        stateInRegionalBloc.forEach(el => {
            if(el.population !== undefined && nameBlock !== undefined)
                regionalBlocs[nameBlock].population += el.population;                
        });
    }

    // dodawanie powierzchni państw w ramach bloków
    const getSumArea = (stateInRegionalBloc: Array<TabWithStates>, nameBlock: RegBlocs) => {
        stateInRegionalBloc.forEach(el => {
            if(typeof el.area === 'number' && nameBlock != undefined)
                regionalBlocs[nameBlock].area += el.area;                
        });
    }

    // dodawanie gęstości zaludnienia do bloków regionalnych
    const getDensity = () => {
        const parametersForDensity: Array<RegBlocs> = ['EU', 'AU', 'NAFTA', 'other'];

        parametersForDensity.forEach( item => {
            regionalBlocs[item].density = parseFloat((regionalBlocs[item].population / regionalBlocs[item].area).toFixed(2));
        });
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
            getSumArea(item[0], item[1]);
            getLanguages(regionalBlocs, item[0], item[1]);
        });
    }

    // konsolowanie informacji o nowym obiekcie
    const showConsole = () => {
        // console.log('tablice z blokami :', [euBlock, auBlock, naftaBlock, otherBlock]);
        console.log('Nowy obiekt z blokami regionalnymi: ', regionalBlocs);
    }

    // kolejnosć wywoływania funkcji
    getRegionalArray(dataFromApi);
    makeObjWithRegBlocs()
    getDensity();
    showConsole();

    return regionalBlocs;
}

export const getInfoRegBloc = (someData:tabRegBloc) => {
    
    // console.log('someData', someData)
    // console.log('Object.keys(ob)', Object.keys(someData))
    // console.log('Object.values(ob)', Object.values(someData))
    // console.log('Object.entries(ob)', Object.entries(someData))
    
    type numberKeyWord = 'population' | 'area' | 'density';
    type arrayKeyWord = 'countries' | 'currencies';

    // funkcje obliczające kolejność bloków pod wzgl różnych kryteriów (m.in. populacji, obszaru, gęstości...)
    const showInfoAboutOrder = (data: tabRegBloc, keyWord: numberKeyWord | arrayKeyWord | 'languages', indexInTable?: number) => {
        const arrKeyValue= Object.entries(data);
        const arrCheckedValue: Array<[string, number ]> = [];
        
        if( keyWord === 'population' || keyWord === 'area' || keyWord === 'density' ) {
            arrKeyValue.forEach( item => {
                if(item[1][keyWord] ) arrCheckedValue.push([item[0], item[1][keyWord] ])
            });
        }

        if( keyWord === 'countries' || keyWord === 'currencies') {
            arrKeyValue.forEach( item => {
                arrCheckedValue.push([item[0], item[1][keyWord].length ])
            });
        }

        if(keyWord === 'languages') {
            arrKeyValue.forEach( item => {
                if(typeof item[1].languages !== 'undefined') {
                    let amountOfLang = Object.keys(item[1].languages);
                    arrCheckedValue.push([item[0], amountOfLang.length ]);
                }
            });
        }
      
        compareValue(arrCheckedValue);
        // console.log(`tablica [blok, ${keyWord}]`, arrCheckedValue);

        if(typeof indexInTable === 'number' && indexInTable >= 0) {
            return arrCheckedValue[indexInTable][0];
        } else {
            return arrCheckedValue;
        }
    }

    // Nazwę organizacji o największej populacji,
    const blockFirstPopulation = showInfoAboutOrder(someData, 'population', 0);
    
    // Nazwę organizacji o drugiej największej gęstości zaludnienia,
    const blockSecondDensity = showInfoAboutOrder(someData, 'density', 1);

    // Nazwę organizacji zajmującej trzeci największy obszar,
    const blockThirdArea = showInfoAboutOrder(someData, 'area', 2)

    // Nazwę organizacji posiadającej najmniejszą liczbę państw członkowskich, 
    const blockLastCountries = showInfoAboutOrder(someData, 'countries', 3);
    
    // Nazwę organizacji wykorzystującej największą liczbę walut,
    const blockFirstCurrencies = showInfoAboutOrder(someData, 'countries', 0)
    
    // Nazwy organizacji o największej przypisanej do nich liczbie języków,
    const blockFirstAmountLanguages = showInfoAboutOrder(someData, 'languages')[0];

    // Nazwy organizacji o najmniejszej przypisanej do nich liczbie języków,
    const blockLastAmountLanguages = showInfoAboutOrder(someData, 'languages');

    console.log(`Blok:
    - pierwszy pod wzgl. populacji: ${blockFirstPopulation},
    - drugi pod wzgl. gęstości: ${blockSecondDensity},
    - trzeci pod wzgl. obszaru: ${blockThirdArea},
    - ostatni pod wzgl. liczby krajów: ${blockLastCountries},
    - pierwszy pod wzgl. liczby walut: ${blockFirstCurrencies},
    - pierwszy pod wzgl. liczby języków: ${blockFirstAmountLanguages[0]},
    - ostatni pod względem liczby języków: ${blockLastAmountLanguages[blockLastAmountLanguages.length-1][0]}
    `)
}

export const getInfoLanguages = (data: Array<TabWithStates>) => {

    // tworzę obiekt zawierający wszystkie języki (bez podziału na bloki regionalne)
    const languages: LangObj = {};

    // funkcja porównująca języki pod względem liczby krajów, populacji, powierzchni państw
    const getTheMostPopularLang = (data:LangObj, keyWord: 'countries' | 'population' | 'area') => {
        const arrKeyValue = Object.entries(data);
        // console.log('1 arrKeyValue', arrKeyValue);
        const arrCheckedValue: Array<[string, number]> = [];

        if(keyWord === 'countries') {
            arrKeyValue.forEach( item => {
                arrCheckedValue.push([item[0], item[1][keyWord].length ])
            });
        }

        if(keyWord === 'population' || keyWord === 'area') {
            arrKeyValue.forEach( item => {
                arrCheckedValue.push([item[0], item[1][keyWord] ])
            });
        }
        
        compareValue(arrCheckedValue)
        // console.log('1 arrCheckedValue po sortowaniu', arrCheckedValue);

        return arrCheckedValue
    }

    // funkcja sprawdzająca remis
    const checkDraw = (tableWithData: Array<[string, number | string[]]>, index: number) => {
        const referenceValue = tableWithData[index];
        const arrExAequo: Array<string> = [];

        tableWithData.forEach( item => {
            if(item[1] == referenceValue[1]) arrExAequo.push(item[0])
        });

        // console.log('arrExAequo', arrExAequo)
        return arrExAequo;
    }

    // funkcja zamieniająca kod języka na nativeName
    const changeCodeToNativeName = (fullData: LangObj, codeLang: Array<string>) => {
        const arrWithNativeName: Array<string> = []
        
        codeLang.forEach( el => arrWithNativeName.push(fullData[el].name));

        // console.log('arrWithNativeName', arrWithNativeName)
        return arrWithNativeName
    }

    // stworzenie obiektu z pełną informacją o językach
    const allLang: LangObj | undefined = getLanguages(languages, data)
    // console.log('obiekt z wszystkimi językami', allLang)

    if(allLang) {
        // Natywna nazwa języka wykorzystywanego w największej liczbie krajów,
        const languagesByCountries = getTheMostPopularLang(allLang, 'countries');
        const codeTheMostPopularLanguage = checkDraw(languagesByCountries, 0);
        const nativeNameTheMostPopularLanguage = changeCodeToNativeName(allLang, codeTheMostPopularLanguage)

        // Natywna nazwa języka wykorzystywanego przez najmniejszą liczbę ludzi,
        const languagesByPopulation = getTheMostPopularLang(allLang, 'population');
        const codeTheLeastPopularLanguage = checkDraw(languagesByPopulation, languagesByPopulation.length-1);
        const nativeNameTheLeastPopularLanguage = changeCodeToNativeName(allLang, codeTheLeastPopularLanguage)

        // Natywne nazwy języków wykorzystywanych na największym obszarze
        const languagesByArea = getTheMostPopularLang(allLang, 'area');
        const codeLanguageTheBiggestArea = checkDraw(languagesByArea, 0);
        const nativeNameLanguageTheBiggestArea = changeCodeToNativeName(allLang, codeLanguageTheBiggestArea)

        // Natywne nazwy języków wykorzystywanych na najmniejszym obszarze
        const codeLanguageTheSmallestArea = checkDraw(languagesByArea, languagesByArea.length-1);
        const nativeNameLanguageTheSmallestArea = changeCodeToNativeName(allLang, codeLanguageTheSmallestArea)

        console.log(`Natywne nazwy języków:
            - używane w największej liczbie państw: ${nativeNameTheMostPopularLanguage},
            - używanych przez najmniejszą liczbę ludzi: ${nativeNameTheLeastPopularLanguage},
            - wykorzystywanych na największym obszarze: ${nativeNameLanguageTheBiggestArea},
            - wykorzystywanych na najmniejszym obszarze: ${nativeNameLanguageTheSmallestArea}`
        )

    } else {
        console.log('Brak obiektu z językami')
    }    
}

