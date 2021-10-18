export interface Texts {
    [key: string]: {
        [key: string]: {
            [key: string]: string,
        }
    }
}

export interface LangObj {
    [key: string]: {
        countries: Array<string>,
        population: number,
        area: number,
        name: string,
    },
}

export interface TabWithStates {
    name: string,
    population: number,
    area?: number,
    density?: number,
    id?: number,
    alpha3Code?: string,
    regionalBlocs?: Array<{acronym: string}>,
    nativeName?: string,
    currencies?: Array<{code: string, name: string, symbol: string}>,
    languages?: Array<{iso639_1: string, iso639_2: string, name: string, nativeName: string}>,
};

export interface RegBlocInfo {
    countries: Array<string>,
    population: number,
    languages?: LangObj,
    currencies: Array<string>,
    area: number,
    density: number,
};

// export interface tabRegBloc {
//     EU: RegBlocInfo,
//     NAFTA: RegBlocInfo,
//     AU: RegBlocInfo,
//     other: RegBlocInfo,
// }

export type RegBlocs = 'EU' | 'NAFTA' | 'AU' | 'other';
export type tabRegBloc = Record<RegBlocs, RegBlocInfo>;