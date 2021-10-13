import { TabWithStates, tabRegBloc } from './config';

export const startRegionalbloc = (dataFromApi: Array<TabWithStates>) => {
    console.log('START danych dla bloków regionalnych');

    const regionalBlocs2: tabRegBloc = {
        EU: { countries: [], population: 0, languages: {}, currencies: [] },
        NAFTA: { countries: [], population: 0, languages: {}, currencies: [] },
        AU: { countries: [], population: 0, languages: {}, currencies: [] },
        other: { countries: [], population: 0, languages: {}, currencies: [] },
    };

    const makeNewObjRegBlocs = (dataFromApi:any) => {
        dataFromApi.forEach((state: any) => {
            if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'EU')) {
                regionalBlocs2.EU.countries.push(state.nativeName);
                regionalBlocs2.EU.countries.sort().reverse();
                if(state.currencies) state.currencies.forEach((item:any) => {
                    if(!regionalBlocs2.EU.currencies.includes(item.code)) regionalBlocs2.EU.currencies.push(item.code)
                })
                if(typeof state.population === 'number') regionalBlocs2.EU.population += state.population;
                if(state.languages) state.languages.forEach((item:any) => {
                    if(regionalBlocs2.EU.languages && regionalBlocs2.EU.languages[item.iso639_1]) {
                        regionalBlocs2.EU.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.EU.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.EU.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.EU.languages[item.iso639_1].name += ` ${state.nativeName}`;
                    } else if(regionalBlocs2.EU.languages) {
                        regionalBlocs2.EU.languages[item.iso639_1] = {
                            countries: [],
                            name: '',
                            population: 0,
                            area: 0
                        };
                        regionalBlocs2.EU.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.EU.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.EU.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.EU.languages[item.iso639_1].name += state.nativeName;
                    }
                })
            }
            else if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'AU')) {
                regionalBlocs2.AU.countries.push(state.nativeName);
                regionalBlocs2.AU.countries.sort().reverse();
                if(state.currencies) state.currencies.forEach((item:any) => {
                    if(!regionalBlocs2.AU.currencies.includes(item.code)) regionalBlocs2.AU.currencies.push(item.code)
                })
                if(typeof state.population === 'number') regionalBlocs2.AU.population += state.population;
                if(state.languages) state.languages.forEach((item:any) => {
                    if(regionalBlocs2.AU.languages && regionalBlocs2.AU.languages[item.iso639_1]) {
                        regionalBlocs2.AU.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.AU.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.AU.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.AU.languages[item.iso639_1].name += ` ${state.nativeName}`;
                    } else if(regionalBlocs2.AU.languages) {
                        regionalBlocs2.AU.languages[item.iso639_1] = {
                            countries: [],
                            name: '',
                            population: 0,
                            area: 0
                        };
                        regionalBlocs2.AU.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.AU.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.AU.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.AU.languages[item.iso639_1].name += state.nativeName;
                    }
                })
            }
            else if(state.regionalBlocs && state.regionalBlocs.find((el: any) => el.acronym === 'NAFTA')) {
                regionalBlocs2.NAFTA.countries.push(state.nativeName);
                regionalBlocs2.NAFTA.countries.sort().reverse();
                if(state.currencies) state.currencies.forEach((item:any) => {
                    if(!regionalBlocs2.NAFTA.currencies.includes(item.code)) regionalBlocs2.NAFTA.currencies.push(item.code)
                })
                if(typeof state.population === 'number') regionalBlocs2.NAFTA.population += state.population;
                if(state.languages) state.languages.forEach((item:any) => {
                    if(regionalBlocs2.NAFTA.languages && regionalBlocs2.NAFTA.languages[item.iso639_1]) {
                        regionalBlocs2.NAFTA.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.NAFTA.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.NAFTA.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.NAFTA.languages[item.iso639_1].name += ` ${state.nativeName}`;
                    } else if(regionalBlocs2.NAFTA.languages) {
                        regionalBlocs2.NAFTA.languages[item.iso639_1] = {
                            countries: [],
                            name: '',
                            population: 0,
                            area: 0
                        };
                        regionalBlocs2.NAFTA.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.NAFTA.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.NAFTA.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.NAFTA.languages[item.iso639_1].name += state.nativeName;
                    }
                })
            }
            else {
                regionalBlocs2.other.countries.push(state.nativeName);
                regionalBlocs2.other.countries.sort().reverse();
                if(state.currencies) state.currencies.forEach((item:any) => {
                    if(!regionalBlocs2.other.currencies.includes(item.code)) regionalBlocs2.other.currencies.push(item.code)
                })
                if(typeof state.population === 'number') regionalBlocs2.other.population += state.population;
                if(state.languages) state.languages.forEach((item:any) => {
                    if(regionalBlocs2.other.languages && regionalBlocs2.other.languages[item.iso639_1]) {
                        regionalBlocs2.other.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.other.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.other.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.other.languages[item.iso639_1].name += ` ${state.nativeName}`;
                    } else if(regionalBlocs2.other.languages) {
                        regionalBlocs2.other.languages[item.iso639_1] = {
                            countries: [],
                            name: '',
                            population: 0,
                            area: 0
                        };
                        regionalBlocs2.other.languages[item.iso639_1].countries.push(state.alpha3Code);
                        regionalBlocs2.other.languages[item.iso639_1].population += state.population;
                        regionalBlocs2.other.languages[item.iso639_1].area += state.area;
                        regionalBlocs2.other.languages[item.iso639_1].name += state.nativeName;
                    }
                })
            }
        })    
    }

    makeNewObjRegBlocs(dataFromApi);
    console.log(regionalBlocs2);
}