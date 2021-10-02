/** ZAD.1 **
 * Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.eu/. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
 * Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
 * 
 * Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
 * Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw. 
 * Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
 * 
 * Stwórz metodę, która przy ponownym ściąganiu danych państw porówna populację między starym 
 * i nowym zestawem danych oraz wyświetli wszystkie nazwy państw, których populacja uległa zmianie.
 * 
 * ZAD.2 **
 * Z Tablicy Państw z zadania 1 przefiltruj wszystkie należące do Unii Europejskiej.
 * Z uzyskanej w ten sposób tablicy usuń wszystkie państwa posiadające w swojej nazwie literę a.
 * Z uzyskanej w ten sposób tablicy posortuj państwa według populacji, tak by najgęściej zaludnione znajdowały się na górze listy. 
 * Zsumuj populację pięciu najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
 *
 * Kod powinien być w pełni otypowany.
 * Kod powinien posiadać pełen zestaw testów (Jest).
 * Kod może posiadać komentarze.
**/



window.onload = function() {
    console.log('App started!');

    tableWithStates.init();
}


// interfejsy zmiennych
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
        addDensityAndSort: {showTable: string},
        removeLetterA: {showTable: string},
        sortByDensity: {showTable: string},
        countPupulationTop5StatesEu: {info: string, moreThan: string, lessThan: string},
    }
};

interface TabWithStates {
    name: {common: string},
    population: number,
    area?: number,
    density?: number,
};

// zmienna zawierająca bibliotekę komunikatów w konsoli
var logsTexts: Texts = {
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
        addDensityAndSort: {
            showTable: 'Państwa UE posortowane wg gęstości',
        },
        removeLetterA: {
            showTable: 'Państwa z UE bez litery `a` w nazwie (posortowane wg gęstości zaludnienia): ',
        },
        sortByDensity: {
            showTable: '',
        },
        countPupulationTop5StatesEu: {
            info: '5 najgęściej zaludnionych państw UE to:',
            moreThan: 'Łączna liczba ludności w 5 najgęściej zaludnionych państwach UE jest większa od 500 mln i wynosi ',
            lessThan: 'Łączna liczba ludności w 5 najgęściej zaludnionych państwach UE jest mniejsza od 500 mln i wynosi ',
        },
    },
}

export class TableWithStates {

    url: string = "https://restcountries.com/v3.1/all";
    dateDownloadFromApi: number = 0;
    tableStatesFromApi: Array<{}> = [];
    tableAfterComparison: Array<{}> = [];
    nameStatesFromEU: Array<string> = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic', 'czechia', 'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden']
    // tableOnlyStatesFromEU: Array<{}> = [];

    init(): void {
        if( this.downloadFromApiAgain( storage.getStorage('date') ) === 'storage' && storage.getStorage('states').length > 0 ) {
            console.log(logsTexts.tableWithStates.init.getFromStorage, storage.getStorage('states').length);
            console.log(logsTexts.tableWithStates.init.dataInStorage, storage.getStorage('states'));
            this.getEuStates(storage.getStorage('states'));
        } else {
            console.log(logsTexts.tableWithStates.init.connectWithApi);
            this.downloadFromAPI();
        }
    }

    // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania (wersja async / await)
    // downloadFromAPI = async() => { 
    //     try {
    //         const response: Response = await fetch(this.url);
    //         console.log('response typ:', typeof response, ' zawartość: ', response);
    //         const responseJson: any = await response.json();
    //         console.log('responseJson typ:', typeof responseJson, ', czy tablica?', Array.isArray(responseJson), ' zawartość: ', responseJson);

    //         console.log(logsTexts.tableWithStates.downloadFromAPI.success, responseJson);

    //         if(storage.getStorage('states') && storage.getStorage('states').length > 0) {
    //             this.infoAboutChangingPopulation(storage.getStorage('states'), responseJson);
    //         }

    //         let time: any = new Date();
    //         this.dateDownloadFromApi = time.getTime();
    //         storage.saveStorage('date', this.dateDownloadFromApi);

    //         storage.saveStorage('states', responseJson);
    //     }
    //     catch(err) {
    //         throw new Error(logsTexts.tableWithStates.downloadFromAPI.failure)
    //         // console.log(logsTexts.tableWithStates.downloadFromAPI.b, ' | ',err)
    //     }
    // }

    downloadFromAPI(): void { 
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                console.log(logsTexts.tableWithStates.downloadFromAPI.success, data);
                this.tableStatesFromApi = data;

                if(storage.getStorage('states') && storage.getStorage('states').length > 0) {
                    this.infoAboutChangingPopulation(storage.getStorage('states'), data);
                }

                let time: Date = new Date();
                this.dateDownloadFromApi = time.getTime();
                storage.saveStorage('date', this.dateDownloadFromApi);
                
                storage.saveStorage('states', data);

                this.getEuStates(data);
            })
            .catch(err => {
                throw new Error(logsTexts.tableWithStates.downloadFromAPI.failure)
            })
    }

    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    downloadFromApiAgain(timeDownloadFromApi: number | null): string {
        const MS_IN_6DAYS: number = 6*24*60*60*1000;
        const MS_FOR_TEST: number = 30*1000;
        const timeNow: number = (new Date).getTime();
        let differenceInMs: number = 0;

        if(typeof timeDownloadFromApi === 'number') {
            differenceInMs = timeNow - timeDownloadFromApi;
            this.countTimeFromLastApi(differenceInMs);
        };
        if(timeDownloadFromApi === null) {
            differenceInMs = MS_FOR_TEST;
        };

        if(differenceInMs >= MS_FOR_TEST) {
            console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromApi);
            return 'api';
        } else {
            console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromStorage, MS_FOR_TEST + 'ms');
            return 'storage';
        }
    }

    //  oblicza czas od ostaniego pobrania z API
    countTimeFromLastApi(timeDownloadInMs: number): void {
        let s: number = Math.floor((timeDownloadInMs/1000)%60); 
        let m: number = Math.floor((timeDownloadInMs/1000/60)%60); 
        let h: number = Math.floor((timeDownloadInMs/1000/60/60)%24); 
        let d: number = Math.floor((timeDownloadInMs/1000/60/60/24)); 

        let result = `${d} dni, ${h} godzin, ${m} min, ${s} sek`;

        console.log(logsTexts.tableWithStates.countTimeFromLastApi.timeFromLastApi, result)
    }

    // porównanie populacji z dwóch zbiorów danych
    comparePopulationBetweenData(stateDataOld: any, stateDataNew:any) { 
        if(stateDataOld.cca3 === stateDataNew.cca3 && 
            stateDataOld.population !== stateDataNew.population) {
            this.tableAfterComparison.push(stateDataOld.name);
            return ;
        }
    }

    // pętla po starym zestawie danych
    infoAboutChangingPopulation(oldData: [], newData: []): void {
        for(let i = 0; i < oldData.length; i++) {
            if(newData.length>0) {
                newData.filter(el => this.comparePopulationBetweenData(el, oldData[i]));
            }
        }
        return (this.tableAfterComparison.length > 0) 
            ? console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.stateWithChangedPopulation, this.tableAfterComparison) 
            : console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.noChangeOfPopulation);
    }

    // generowanie tablicy TYLKO z danymi o państwach UE + wyeliminować ryzyko różnego zapisu nazwy kraju (małe / duże litery)
    getEuStates(allStates: Array<TabWithStates>): void {
        const onlyStatesEU: Array<TabWithStates> = [];

        allStates.forEach(item => {
            this.nameStatesFromEU.find(el => {
                if(el === (item.name.common.toLowerCase())) onlyStatesEU.push(item);
            });
        });

        console.log(logsTexts.tableWithStates.getEuStates.showTable, onlyStatesEU);

        const tableWithStatesEU = new TableWithStatesEU(onlyStatesEU);
        tableWithStatesEU.addDensityAndSort();
        // console.log('nowa instancja', tableWithStatesEU);
    }
}

const tableWithStates = new TableWithStates();
console.log('tableWithStates:', tableWithStates)

// klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API
export class StorageBrowser {
    getStorage(key: string): any {
        let content: number | [] | null = null;
        let contentInLocalStorage: string|null = localStorage.getItem(key);

        if(contentInLocalStorage !== null) { 
            content = JSON.parse(contentInLocalStorage);
        } else {
            content = null;
            console.log(logsTexts.storage.getStorage.failure, key);
        }
        // console.log(key, 'content', typeof content, 'czy tablica: ', Array.isArray(content));
        return content;
    }

    saveStorage(key: string, item: any ): void {
        // console.log('item w saveStorage', typeof item, 'klucz', key, ' zawartość: ', item);
        if(item === null || item === undefined) {
            return console.log(logsTexts.storage.saveStorage.failure)
        };
        if(typeof item == 'number') {
            localStorage.setItem(key, `${item}`)
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}

const storage = new StorageBrowser();

// klasa państw z UE
class TableWithStatesEU {
    states: Array<TabWithStates>;
    tableStatesWithDensity: Array<TabWithStates> = [];
    tableStatesWithoutLetterA: Array<TabWithStates> = [];
    tableStatesSortByDensity: Array<TabWithStates> = [];

    constructor(states: Array<TabWithStates>) {
        this.states = states;
    }

    // dodaj gęstość zaludnienia
    addDensityAndSort() {
        this.tableStatesWithDensity = JSON.parse(JSON.stringify(this.states)) // klonowanie głębokie (nie ma referencji w obiektach zagłębionych, ale np. problem będzie z undefined)
        
        this.tableStatesWithDensity.forEach(item => {
            if(item.population != undefined && item.area != undefined) item.density = parseFloat((item.population / item.area).toFixed(2));
        });
        // console.log('tabela państw z gęstością zaludnienia:', this.tableStatesWithDensity);

        function compare(a: TabWithStates, b: TabWithStates): number {
            if(a.density != undefined && b.density != undefined) {
                if (a.density > b.density) {
                    return -1;
                }
                if (a.density < b.density) {
                    return 1;
                }
                return 0;
            }
            return 0;
        }

        this.tableStatesWithDensity.sort(compare);
        console.log(logsTexts.tableWithStatesEU.addDensityAndSort.showTable, this.tableStatesWithDensity)

        this.removeLetterA();
        this.countPupulationTop5StatesEu();
    }

    // usunąć państwa posiadające literę A lub a
    removeLetterA() {
        this.tableStatesWithDensity.forEach( item => {
            if( !(item.name.common).toLowerCase().includes('a') ) this.tableStatesWithoutLetterA.push(item);
        })

        console.log(logsTexts.tableWithStatesEU.removeLetterA.showTable, this.tableStatesWithoutLetterA);
    }

    // suma populacji 5 najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
    countPupulationTop5StatesEu() {
        const top5ByDensity = this.tableStatesWithDensity.slice(0,5);
        const nameTop5: string[] = [];
        let sumOfPopulation: number = 0;

        for(let i=0; i<top5ByDensity.length; i++) {
            sumOfPopulation += top5ByDensity[i].population;
            nameTop5.push(top5ByDensity[i].name.common);
        }

        console.log(logsTexts.tableWithStatesEU.countPupulationTop5StatesEu.info, nameTop5.join(', '))

        if(sumOfPopulation > 500000000) {
            return console.log(logsTexts.tableWithStatesEU.countPupulationTop5StatesEu.moreThan, sumOfPopulation.toString());
        } else {
            return console.log(logsTexts.tableWithStatesEU.countPupulationTop5StatesEu.lessThan, sumOfPopulation.toString()); 
        }
    }
    
}
