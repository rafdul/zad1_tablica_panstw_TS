import { TabWithStates, LangObj, RegBlocs, tabRegBloc } from "./config";

export const compareValue = (tableWithData: Array<[string, number | string[] | LangObj | undefined]>) => {
    function compare(a:any, b:any): number  {
        if(typeof a[1] === 'number' && typeof b[1] === 'number') {
            if (a[1] > b[1]) {
                return -1;
            }
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

export const addDataToObjLanguage = (referenceToObj: any, country: TabWithStates, codeLang: string, nativeNameLang: string, langExist: boolean = false) => {
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

export const getLanguages = (referencjeToObj:any, stateInRegionalBloc: Array<TabWithStates>, nameBlock?: RegBlocs) => {
    let languagesObj: LangObj | undefined = {};
    if(nameBlock != undefined) {
        languagesObj = referencjeToObj[nameBlock].languages;
    } else {
        languagesObj = referencjeToObj
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
