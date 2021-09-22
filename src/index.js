"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.onload = function () {
    console.log('App started!');
    tableWithStates.init();
};
;
// zmienna zawierająca bibliotekę komunikatów w konsoli
var textsForConsoleLog = {
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
};
class TableWithStates {
    constructor() {
        this.url = "https://restcountries.com/v3/all";
        this.dateDownloadFromApi = 0;
        this.tableAfterComparison = [];
        // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania (wersja async / await)
        this.downloadFromAPI = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.url);
                const responseJson = yield response.json();
                console.log(textsForConsoleLog.tableWithStates.downloadFromAPI.a, responseJson);
                if (storage.getStorage('states').length > 0) {
                    this.infoAboutChangingPopulation(storage.getStorage('states'), responseJson);
                }
                let time = new Date();
                this.dateDownloadFromApi = time.getTime();
                storage.saveStorage('date', this.dateDownloadFromApi);
                storage.saveStorage('states', responseJson);
            }
            catch (err) {
                console.log(textsForConsoleLog.tableWithStates.downloadFromAPI.b, ' | ', err);
            }
        });
    }
    init() {
        if (this.downloadFromApiAgain(storage.getStorage('date')) === false && storage.getStorage('states').length > 0) {
            console.log(textsForConsoleLog.tableWithStates.init.a, storage.getStorage('states').length);
            console.log(textsForConsoleLog.tableWithStates.init.b, storage.getStorage('states'));
        }
        else {
            console.log(textsForConsoleLog.tableWithStates.init.c);
            this.downloadFromAPI();
        }
    }
    // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)
    downloadFromApiAgain(timeDownloadFromApi) {
        const MS_IN_6DAYS = 6 * 24 * 60 * 60 * 1000;
        const MS_FOR_TEST = 15 * 1000;
        const timeNow = (new Date).getTime();
        const differenceInMs = timeNow - timeDownloadFromApi;
        if (differenceInMs <= MS_FOR_TEST) {
            console.log(textsForConsoleLog.tableWithStates.downloadFromApiAgain.a, MS_FOR_TEST + 'ms');
            return false;
        }
        else {
            console.log(textsForConsoleLog.tableWithStates.downloadFromApiAgain.b);
            return true;
        }
    }
    // porównanie populacji z dwóch zbiorów danych
    comparePopulationBetweenData(stateDataOld, stateDataNew) {
        // console.log('typ stateDataOld:', typeof stateDataOld, '| ', stateDataOld); //typ object
        // console.log('typ stateDataNew:', typeof stateDataNew, '| ', stateDataNew);
        if (stateDataOld.alpha3Code === stateDataNew.alpha3Code) {
            if (stateDataOld.population !== stateDataNew.population) {
                // console.log('liczba ludności zmieniła się w: ', stateDataOld.name);
                this.tableAfterComparison.push(stateDataOld.name);
                return;
            }
        }
    }
    // pętla po starym zestawie danych
    infoAboutChangingPopulation(oldData, newData) {
        for (let i = 0; i < oldData.length; i++) {
            newData.find(el => this.comparePopulationBetweenData(el, oldData[i]));
        }
        return (this.tableAfterComparison.length > 0)
            ? console.log(textsForConsoleLog.tableWithStates.infoAboutChangingPopulation.a, this.tableAfterComparison)
            : console.log(textsForConsoleLog.tableWithStates.infoAboutChangingPopulation.b);
    }
}
const tableWithStates = new TableWithStates();
// klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API
class StorageBrowser {
    getStorage(key) {
        let content = null;
        if (localStorage.getItem(key) !== null || localStorage.getItem(key) !== undefined) {
            if (localStorage.getItem(key) == 'number') {
                content = localStorage.getItem(key);
            }
            else {
                content = JSON.parse(localStorage.getItem(key));
            }
        }
        else {
            content = [];
        }
        return content;
    }
    saveStorage(key, item) {
        if (item === null || item === undefined)
            return console.log(textsForConsoleLog.storage.saveStorage.a);
        if (typeof item == 'number')
            localStorage.setItem(key, JSON.stringify(item));
        localStorage.setItem(key, JSON.stringify(item));
    }
}
const storage = new StorageBrowser();
