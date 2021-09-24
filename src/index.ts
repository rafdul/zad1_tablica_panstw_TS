/**
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
        init: {a: string, b: string, c: string},
        downloadFromAPI: {a: string, b: string},
        downloadFromApiAgain: {a: string, b: string},
        countTimeFromLastApi: {a: string},
        infoAboutChangingPopulation: {a: string, b: string},
    },
    storage: {
        saveStorage: {a: string}
    }
};

// zmienna zawierająca bibliotekę komunikatów w konsoli
var textsForConsoleLog: Texts = {
    tableWithStates: {
        init: {
            a: 'Pobrałem dane zapisane w localStorage. Liczba państw w localStorage to: ',
            b: 'Dane państw zapisane w localStorage: ',
            c: 'Łączę się z API',
        },
        downloadFromAPI: {
            a: 'Dane państw pobrane z API:',
            b: 'Brak łączności z API',
        },
        downloadFromApiAgain: {
            a: 'Korzystam z localstorage i nie pobieram nowych danych z API. Od ostatniego pobrania z API upłynęło mniej niż ',
            b: 'Od ostatniego pobrania z API upłynęło więcej niż 6 dni, więc ponownie pobieram dane z API.',
        },
        countTimeFromLastApi: {
            a: 'Od ostatniego pobrania z API minęło: ',
        },
        infoAboutChangingPopulation: {
            a: 'Od ostatniego pobrania z API zmieniła się liczba ludności w krajach: ',
            b: 'Od ostatniego pobrania z API nie zmieniła się liczba ludności w żadnym kraju.',
        }
    },
    storage: {
        saveStorage: {
            a: 'Błąd zapisu w localStorage (brak przekazanych danych)',
        }
    }
}

class TableWithStates {

    url: string = "https://restcountries.com/v3/all";
    dateDownloadFromApi: number = 0;
    tableAfterComparison: Array<{}> = [];

    init(): void {
        if( this.downloadFromApiAgain( storage.getStorage('date') ) === false && storage.getStorage('states').length > 0 ) {
            console.log(textsForConsoleLog.tableWithStates.init.a, storage.getStorage('states').length);
            console.log(textsForConsoleLog.tableWithStates.init.b, storage.getStorage('states'));
        } else {
            console.log(textsForConsoleLog.tableWithStates.init.c);
            this.downloadFromAPI();
        }
    }

    // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania (wersja async / await)
    // downloadFromAPI = async() => { 
    //     try {
    //         const response = await fetch(this.url);
    //         console.log('response typ:', typeof response, ' zawartość: ', response);
    //         const responseJson = await response.json();
    //         console.log('responseJson typ:', typeof responseJson, ', czy tablica?', Array.isArray(responseJson), ' zawartość: ', responseJson);

    //         console.log(textsForConsoleLog.tableWithStates.downloadFromAPI.a, responseJson);

    //         if(storage.getStorage('states').length > 0) {
    //             this.infoAboutChangingPopulation(storage.getStorage('states'), responseJson);
    //         }

    //         let time: any = new Date();
    //         this.dateDownloadFromApi = time.getTime();
    //         storage.saveStorage('date', this.dateDownloadFromApi);

    //         storage.saveStorage('states', responseJson);
    //     }
    //     catch(err) {
    //         throw new Error(textsForConsoleLog.tableWithStates.downloadFromAPI.b)
    //         // console.log(textsForConsoleLog.tableWithStates.downloadFromAPI.b, ' | ',err)
    //     }
    // }

    downloadFromAPI(): void { 
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                console.log(textsForConsoleLog.tableWithStates.downloadFromAPI.a, data);

                if(storage.getStorage('states') && storage.getStorage('states').length > 0) {
                    this.infoAboutChangingPopulation(storage.getStorage('states'), data);
                }

                let time: Date = new Date();
                this.dateDownloadFromApi = time.getTime();
                storage.saveStorage('date', this.dateDownloadFromApi);
                
                storage.saveStorage('states', data);
            })
            .catch(err => {
                throw new Error(textsForConsoleLog.tableWithStates.downloadFromAPI.b)
            })
    }

    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    downloadFromApiAgain(timeDownloadFromApi: number[]): boolean {
        const MS_IN_6DAYS: number = 6*24*60*60*1000;
        const MS_FOR_TEST: number = 30*1000;
        const timeNow: number = (new Date).getTime();
        let differenceInMs: number = 0
        if(timeDownloadFromApi.length === 1) {
            differenceInMs = timeNow - timeDownloadFromApi[0];

            this.countTimeFromLastApi(differenceInMs);
        }

        if(differenceInMs <= MS_IN_6DAYS) {
            console.log(textsForConsoleLog.tableWithStates.downloadFromApiAgain.a, MS_IN_6DAYS + 'ms')
            return false;
        } else {
            console.log(textsForConsoleLog.tableWithStates.downloadFromApiAgain.b)
            return true;
        }
    }

    //  oblicza czas od ostaniego pobrania z API
    countTimeFromLastApi(timeDownload: number): void {
        let sek: number = timeDownload/1000;
        let min: number = sek/60;
        let hours: number = min/60;
        let days: number = hours/24

        let leftSek: number = Math.floor(sek%60);
        let leftMin: number = Math.floor(min%60);
        let leftHours: number = Math.floor(hours%24);
        let leftDays: number = Math.floor(days);

        let result = `${leftDays} dni, ${leftHours} godzin, ${leftMin} min, ${leftSek} sek`;

        console.log(textsForConsoleLog.tableWithStates.countTimeFromLastApi.a, result)
    }

    // porównanie populacji z dwóch zbiorów danych
    comparePopulationBetweenData(stateDataOld: any, stateDataNew:any) {
        if(stateDataOld.alpha3Code === stateDataNew.alpha3Code) {
            if(stateDataOld.population !== stateDataNew.population) {
                this.tableAfterComparison.push(stateDataOld.name);
                return ;
            } 
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
            ? console.log(textsForConsoleLog.tableWithStates.infoAboutChangingPopulation.a, this.tableAfterComparison) 
            : console.log(textsForConsoleLog.tableWithStates.infoAboutChangingPopulation.b);
    }
}

let tableWithStates = new TableWithStates();

// klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API
class StorageBrowser {
    getStorage(key: string): any {
        let content: number[] | [] = [];
        let contentInLocalStorage: string|null = localStorage.getItem(key);

        if(contentInLocalStorage !== null) {
            let fromJSON: any = JSON.parse(contentInLocalStorage);
            if (typeof fromJSON === 'number') {
                let newTab: number[] = [];
                newTab.push(fromJSON);
                content = newTab;
            } else {
                content = fromJSON;
            }            
        } else {
            content = [];
        }
        // console.log(key, 'content', typeof content, 'czy tablica: ', Array.isArray(content));
        return content;
    }

    saveStorage(key: string, item: any ): void {
        // console.log('item w saveStorage', typeof item, 'klucz', key, ' zawartość: ', item);
        if(item === null || item === undefined) {
            return console.log(textsForConsoleLog.storage.saveStorage.a)
        };
        if(typeof item == 'number') {
            localStorage.setItem(key, `${item}`)
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}

const storage = new StorageBrowser();

