import { logsTexts, MS_IN_6DAYS, apiUrl } from './config'
import { TabWithStates } from './types';
import { tableWithStatesEU } from './tableWithStatesEU';
import { storage } from './storage';
import { makeRegionalBlocs, getInfoRegBloc, getInfoLanguages } from './tableRegionalBloc';

export class TableWithStates {

    private url: string = apiUrl;
    private dateDownloadFromApi: number = 0;
    private tableAfterComparison: Array<string> = [];

    init(): void {
        if( this.downloadFromApiAgain( storage.getStorage('date') ) === 'storage' && storage.getStorage('states').length > 0 ) {
            console.log(logsTexts.tableWithStates.init.getFromStorage, storage.getStorage('states').length);
            console.log(logsTexts.tableWithStates.init.dataInStorage, storage.getStorage('states'));
            this.selectStatesByBlock(storage.getStorage('states'), 'EU');
            this.createRegionalBlocs(storage.getStorage('states'));
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

    transferDataFromAPI(dataFromAPI: Array<TabWithStates>): void {
        this.dateDownloadFromApi = (new Date).getTime();

        if(storage.getStorage('states')  && storage.getStorage('states').length > 0) {
            this.infoAboutChangingPopulation(storage.getStorage('states'), dataFromAPI);
        }

        this.useStorage(dataFromAPI, this.dateDownloadFromApi);
                
        this.selectStatesByBlock(dataFromAPI, 'EU');

        this.createRegionalBlocs(dataFromAPI);
    }

    useStorage(dataFromAPI: Array<TabWithStates>, dateDownload: number): void {
        storage.saveStorage('date', dateDownload);
        
        storage.saveStorage('states', dataFromAPI);
    }

    // sprawdzenie, czy ponowanie pobra?? dane z API (zwr??cenie flagi true = pobra??, false = korzysta?? z localStorage)
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

    // por??wnanie populacji z dw??ch zbior??w danych
    comparePopulationBetweenData(stateDataOld: TabWithStates, stateDataNew: TabWithStates): void { 
        if(stateDataOld.alpha3Code === stateDataNew.alpha3Code && 
            stateDataOld.population !== stateDataNew.population) {
            this.tableAfterComparison.push(stateDataOld.name);
            return ;
        }
    }

    // p??tla po starym zestawie danych
    infoAboutChangingPopulation(oldData: Array<TabWithStates>, newData: Array<TabWithStates>): void {
        for(let i = 0; i < oldData.length; i++) {
            if(newData.length>0) {
                newData.filter(el => this.comparePopulationBetweenData(el, oldData[i]));
            }
        }
        return (this.tableAfterComparison.length > 0) 
            ? console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.stateWithChangedPopulation, this.tableAfterComparison) 
            : console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.noChangeOfPopulation);
    }

    // generowanie tablicy TYLKO z danymi o pa??stwach UE + wyeliminowa?? ryzyko r????nego zapisu nazwy kraju (ma??e / du??e litery)
    selectStatesByBlock(allStates: Array<TabWithStates>, keyBlock: string): Array<TabWithStates> {
        let  onlyStatesEU: Array<TabWithStates> = [];

        /* metoda z wykorzystaniem klucza "regionalBloc", kt??ra zwraca w??r??d cz??onk??w UE kilka terytori??w zale??nych (np. Gujana Fr, Gibraltar) */
        allStates.filter(el => {
            if(el.regionalBlocs && el.regionalBlocs.find(i => i.acronym === keyBlock)) {
                onlyStatesEU.push(el);
            }
        });

        /* metoda korzystaj??ca ze s??ownika zawieraj??cego faktycznych cz??onk??w UE 
        const nameStatesFromEU: Array<string> = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic', 'czechia', 'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden']
        onlyStatesEU = allStates.filter(el => nameStatesFromEU.includes(el.name.toLowerCase()));*/
        
        // console.log(logsTexts.tableWithStates.getEuStates.showTable, onlyStatesEU);

        tableWithStatesEU.init(onlyStatesEU);
        
        return onlyStatesEU;
    }

    createRegionalBlocs(dataFromAPI: Array<TabWithStates>): void {
        // makeRegionalBlocs(dataFromAPI);
        getInfoRegBloc(makeRegionalBlocs(dataFromAPI));
        getInfoLanguages(dataFromAPI);
    }
}

export const tableWithStates = new TableWithStates();
// console.log('tableWithStates:', tableWithStates);