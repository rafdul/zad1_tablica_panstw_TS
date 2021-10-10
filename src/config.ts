// export const MS_IN_6DAYS: number = 6*24*60*60*1000;
export const MS_IN_6DAYS: number = 30*1000; // wartość do testów
export const apiUrl: string = 'https://restcountries.com/v2/all';

interface Texts {
    tableWithStates: {
        init: {getFromStorage: string, dataInStorage: string, connectWithApi: string},
        downloadFromAPI: {success: string, failure: string},
        downloadFromApiAgain: {useDataFromStorage: string, useDataFromApi: string},
        countTimeFromLastApi: {timeFromLastApi: string},
        infoAboutChangingPopulation: {stateWithChangedPopulation: string, noChangeOfPopulation: string},
        getEuStates: {showTable: string},
    },
    storage: {
        saveStorage: {failure: string},
        getStorage: {failure: string},
    },
    tableWithStatesEU: {
        compareStates: {showTable: string},
        removeLetterA: {showTable: string},
        sortByDensity: {showTable: string},
        countEUPopulation: {prelude: string, moreThan: string, lessThan: string, infoAboutStates: string},
    }
};

export interface TabWithStates {
    name: string,
    population: number,
    area?: number,
    density?: number,
    id?: number,
    alpha3Code?: string,
    regionalBlocs: Array<{acronym: string}>
};

// zmienna zawierająca bibliotekę komunikatów w konsoli
export var logsTexts: Texts = {
    tableWithStates: {
        init: {
            getFromStorage: 'Pobrałem dane zapisane w localStorage. Liczba państw w localStorage to: ',
            dataInStorage: 'Dane państw zapisane w localStorage: ',
            connectWithApi: 'Łączę się z API',
        },
        downloadFromAPI: {
            success: 'Dane państw pobrane z API:',
            failure: 'Brak łączności z API',
        },
        downloadFromApiAgain: {
            useDataFromStorage: 'Korzystam z localstorage i nie pobieram nowych danych z API. Od ostatniego pobrania z API upłynęło mniej niż ',
            useDataFromApi: 'Od ostatniego pobrania z API upłynęło więcej niż 6 dni, więc ponownie pobieram dane z API.',
        },
        countTimeFromLastApi: {
            timeFromLastApi: 'Od ostatniego pobrania z API minęło: ',
        },
        infoAboutChangingPopulation: {
            stateWithChangedPopulation: 'Od ostatniego pobrania z API zmieniła się liczba ludności w krajach: ',
            noChangeOfPopulation: 'Od ostatniego pobrania z API nie zmieniła się liczba ludności w żadnym kraju.',
        },
        getEuStates: {
            showTable: 'Państwa z UE: ',
        },
    },
    storage: {
        saveStorage: {
            failure: 'Błąd zapisu w localStorage (brak przekazanych danych)',
        },
        getStorage: {
            failure: 'W localStorage nie ma danych pod kluczem ',
        },
    },
    tableWithStatesEU: {
        compareStates: {
            showTable: 'Państwa UE posortowane wg gęstości',
        },
        removeLetterA: {
            showTable: 'Państwa z UE bez litery `a` w nazwie (posortowane wg gęstości zaludnienia): ',
        },
        sortByDensity: {
            showTable: '',
        },
        countEUPopulation: {
            prelude: 'Łączna liczba ludności w ',
            moreThan: 'najgęściej zaludnionych państwach UE jest większa od 500 mln i wynosi ',
            lessThan: 'najgęściej zaludnionych państwach UE jest mniejsza od 500 mln i wynosi ',
            infoAboutStates: '- te państwa to:',
        },
    },
}