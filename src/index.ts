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

import { TabWithStates, logsTexts, MS_IN_6DAYS, apiUrl } from './config'

window.onload = function() {
    console.log('App started!');

    tableWithStates.init();
}

export class TableWithStates {

    private url: string = apiUrl;
    private dateDownloadFromApi: number = 0;
    private tableStatesFromApi: Array<{}> = [];
    private tableAfterComparison: Array<{}> = [];

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

    downloadFromAPI(): void { 
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                console.log(logsTexts.tableWithStates.downloadFromAPI.success, data);

                this.transferDataFromAPI(data);
            })
            .catch(err => {
                throw new Error(logsTexts.tableWithStates.downloadFromAPI.failure)
            })
    }

    transferDataFromAPI(dataFromAPI: any): void {
        this.tableStatesFromApi = dataFromAPI;
        let dateDownloadFromApi: number = (new Date).getTime()
        this.dateDownloadFromApi = dateDownloadFromApi;

        if(storage.getStorage('states') && storage.getStorage('states').length > 0) {
            this.infoAboutChangingPopulation(storage.getStorage('states'), dataFromAPI);
        }

        this.useStorage(dataFromAPI, dateDownloadFromApi);

        this.getEuStates(dataFromAPI);
    }

    useStorage(dataFromAPI: any, dateDownload: number): void {
        storage.saveStorage('date', dateDownload);
        
        storage.saveStorage('states', dataFromAPI);
    }

    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    downloadFromApiAgain(timeDownloadFromApi: number | null): string {
        const timeNow: number = (new Date).getTime();
        let differenceInMs: number = 0;

        if(typeof timeDownloadFromApi === 'number') {
            differenceInMs = timeNow - timeDownloadFromApi;
            this.countTimeFromLastApi(differenceInMs);
        };
        if(timeDownloadFromApi === null) {
            differenceInMs = MS_IN_6DAYS;
        };

        if(differenceInMs >= MS_IN_6DAYS) {
            console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromApi);
            return 'api';
        } else {
            console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromStorage, MS_IN_6DAYS + 'ms');
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
        if(stateDataOld.alpha3Code === stateDataNew.alpha3Code && 
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
    getEuStates(allStates: Array<TabWithStates>):Array<TabWithStates> {
        let  onlyStatesEU: Array<TabWithStates> = [];

        /* metoda z wykorzystaniem klucza "regionalBloc", która zwraca wśród członków UE kilka terytoriów zależnych (np. Gujana Fr, Gibraltar) */
        allStates.filter(el => {
            if(el.regionalBlocs && el.regionalBlocs.find(i => i.acronym === 'EU')) {
                onlyStatesEU.push(el);
            }
        });

        /* metoda korzystająca ze słownika zawierającego faktycznych członków UE */
        // const nameStatesFromEU: Array<string> = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic', 'czechia', 'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden']
        // onlyStatesEU = allStates.filter(el => nameStatesFromEU.includes(el.name.toLowerCase()));
        
        console.log(logsTexts.tableWithStates.getEuStates.showTable, onlyStatesEU);

        const tableWithStatesEU = new TableWithStatesEU(onlyStatesEU);
        tableWithStatesEU.init();
        
        return onlyStatesEU;
    }
}

const tableWithStates = new TableWithStates();
// console.log('tableWithStates:', tableWithStates);

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
export class TableWithStatesEU {
    private states: Array<TabWithStates>;
    private tableStatesWithoutLetterA: Array<TabWithStates> = [];

    constructor(states: Array<TabWithStates>) {
        this.states = states;
    }

    init() {
        this.addDensityAndSort();
    }

    // dodaj gęstość zaludnienia
    addDensityAndSort() {        
        this.states.forEach(item => {
            if(item.population != undefined && item.area != undefined) {
                item.density = parseFloat((item.population / item.area).toFixed(2));
            }
        });

        this.compareStates(this.states, 'density')
        this.removeLetterA(this.states, 'a');
        this.countPopulationForAFewStatesEu(this.states, 5);
    }

    // sortowanie państw wg jakiegoś kryterium (keyBySort)
    compareStates(tableWithStates:Array<TabWithStates>, keyBySort:string):Array<TabWithStates> {
        function compare(a:any, b:any): number  {
            if(typeof a[keyBySort] === 'number' && typeof b[keyBySort] === 'number') {
                if (a[keyBySort] > b[keyBySort]) {
                    return -1;
                }
                if (a[keyBySort] < b[keyBySort]) {
                    return 1;
                }
                return 0;
            }
            return 0;
        }

        tableWithStates.sort(compare)
        console.log(logsTexts.tableWithStatesEU.compareStates.showTable, tableWithStates)
        return tableWithStates;
    }

    // usunąć państwa posiadające literę A lub a
    removeLetterA(tableWithStates: Array<TabWithStates>, letter: string): Array<TabWithStates> {
        tableWithStates.forEach( item => {
            if( !(item.name).toLowerCase().includes(letter) ) this.tableStatesWithoutLetterA.push(item);
        })

        console.log(logsTexts.tableWithStatesEU.removeLetterA.showTable, this.tableStatesWithoutLetterA);
        return this.tableStatesWithoutLetterA;
    }

    // suma populacji 5 najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
    countPopulationForAFewStatesEu(tableWithStates:Array<TabWithStates>, amountStates: number): number {
        const onlyTopStates = tableWithStates.slice(0,amountStates);
        const nameTopStates: string[] = onlyTopStates.map(el => el.name);
        const sumOfPopulation: number = onlyTopStates.reduce( (a,b) => a + b.population, 0)

        console.log(amountStates + logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.info + nameTopStates.join(', '))

        if(sumOfPopulation > 500000000) {
            console.log(logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.moreThan, sumOfPopulation.toString());
        } else {
            console.log(logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.lessThan, sumOfPopulation.toString()); 
        }

        return sumOfPopulation;
    }
}
