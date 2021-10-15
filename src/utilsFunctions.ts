import { TabWithStates, LangObj, RegBlocs } from "./config";

export const compareValue = (tableWithData: Array<[string, number ]>) => {
    function compare(a:any, b:any): number  {
        if(typeof a[1] === 'number' && typeof b[1] === 'number') {
            if (a[1] > b[1]) {
                return -1;
            }
            if (a[1] < b[1]) {
                return 1;
            }
            return 0;
        }
        return 0;
    }
    return tableWithData.sort(compare)
}

export const createObjLanguage = (object: any, codeLang: string) => {
    return object[codeLang] = {
        countries: [],
        name: '',
        population: 0,
        area: 0
    }
}

export const addDataToObjLanguage = (objectWithLanguages: any, country: TabWithStates, codeLang: string, nativeNameLang: string, langExist: boolean = false) => {
    if(objectWithLanguages != undefined) {
        if(country.alpha3Code) objectWithLanguages[codeLang].countries.push(country.alpha3Code);
        if(country.population) objectWithLanguages[codeLang].population += country.population;
        if(country.area) objectWithLanguages[codeLang].area += country.area;      
        if(langExist) {
            // if(country.nativeName) objectWithLanguages[codeLang].name += `, ${nativeNameLang}`;
        } else {
            if(country.nativeName) objectWithLanguages[codeLang].name += nativeNameLang;
        }
    }
}

export const getLanguages = (objectWithLanguages:any, stateInRegionalBloc: Array<TabWithStates>, nameBlock?: RegBlocs) => {
    let languagesObj: LangObj | undefined = {};
    if(nameBlock != undefined) {
        languagesObj = objectWithLanguages[nameBlock].languages;
    } else {
        languagesObj = objectWithLanguages
    }

    stateInRegionalBloc.forEach(singleState => {
        if(Array.isArray(singleState.languages) && languagesObj != undefined) {
            singleState.languages.forEach(singleLanguage => {

                if(languagesObj != undefined && languagesObj[singleLanguage.iso639_1]) {
                    addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1, singleLanguage.nativeName, true)
                } else if (languagesObj != undefined) {
                    createObjLanguage(languagesObj, singleLanguage.iso639_1);
                    addDataToObjLanguage(languagesObj, singleState, singleLanguage.iso639_1, singleLanguage.nativeName)
                }

            });
        } else {
            console.log(`${singleState.name} nie posiada informacji o językach`);
        }
    });

    return languagesObj;
}
