import { TableWithStates, StorageBrowser, TableWithStatesEU } from './index';
import { mockValues } from './mocks'

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;

// tests for class TableWithStates
describe('Tests class TableWithStates. Check,', () => {
    const states: Array<{}> = mockValues.states0;
    const unmockedFetch: any = global.fetch;

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();
        
        global.fetch = (): any => Promise.resolve({
            json: () => Promise.resolve(states),
        })
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
        global.fetch = unmockedFetch;
    });
    
    test('if new object is created as instance of TableWithStates ', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });

    // test('if app can connect with API (fetch in downloadFromAPI)', async () => {
    //     try{
    //         const response = await fetch(JSON.stringify(states));
    //         const responseJson = await response.json();
    //         // console.log('{{{{{{{{{{z api}}}}}}}}}}:', typeof responseJson, 'lenght:', responseJson.length);
    //         expect(Array.isArray(responseJson)).toEqual(true);
    //         expect(responseJson.length).toEqual(3);
    //         expect(responseJson.some((el: any) => el.name === 'Kenia')).toBe(true);

    //     } catch(err) {
    //         console.log(err);
    //     }
    // });

    test('if data from API are transfered to other methods (storage is empty)', () => {
        let dataFromAPI = mockValues.states0;
        newTableWithStatesFromAPI.getEuStates = jest.fn();
        newTableWithStatesFromAPI.useStorage = jest.fn();

        newTableWithStatesFromAPI.transferDataFromAPI(dataFromAPI)

        expect(newTableWithStatesFromAPI.getEuStates).toHaveBeenCalledTimes(1);
        expect(newTableWithStatesFromAPI.useStorage).toHaveBeenCalledTimes(1);
    });

    test('if data from API are transfered to other methods (there are data in storage)', () => {
        let dataFromAPI = mockValues.states0;
        newStorage.saveStorage('states', dataFromAPI)
        newTableWithStatesFromAPI.getEuStates = jest.fn();
        newTableWithStatesFromAPI.useStorage = jest.fn();
        newTableWithStatesFromAPI.infoAboutChangingPopulation = jest.fn();

        newTableWithStatesFromAPI.transferDataFromAPI(dataFromAPI)

        expect(newTableWithStatesFromAPI.getEuStates).toHaveBeenCalledTimes(1);
        expect(newTableWithStatesFromAPI.useStorage).toHaveBeenCalledTimes(1);
        expect(newTableWithStatesFromAPI.infoAboutChangingPopulation).toHaveBeenCalledTimes(1);
    })
});

describe('Tests class TableWithStates. Check, if app use local storage or API again:', () => {
    let number6Days = mockValues.time.number6Days;
    let numberGreaterThan6Days = mockValues.time.numberGreaterThan6Days;
    let numberLess6Days_1ms = mockValues.time.numberLess6Days;
    let numberLess6Days2_nearly6Days = mockValues.time.numberLess6Days_v2;
    let numberLess6Days3_1s = mockValues.time.numberLess6Days_v3;
    let notNumber = null;

    let arrApi = [number6Days, numberGreaterThan6Days, notNumber];
    let arrStorage = [numberLess6Days_1ms, numberLess6Days2_nearly6Days, numberLess6Days3_1s]

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
    });

    test('- app should choose API', () => {
        for(let i=0; i<arrApi.length; i++) {
            console.log('====api===', arrApi[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i]))
            expect(newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i])).toBe('api')
        }
    });

    test('- app should choose local storage', () => {
        for(let i=0; i<arrStorage.length; i++) {
            console.log('====storage===', arrStorage[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrStorage[i]))
            expect(newTableWithStatesFromAPI.downloadFromApiAgain(arrStorage[i])).toBe('storage')
        }
    });
})

describe('Tests class TableWithStates. Check, if app can compare population between new and old data:', () => {
    let arrWithNewPopulation: Array<{}> = [];
    const newData = mockValues.states0;
    const oldData1 = mockValues.states3;
    const oldData2 = mockValues.states0;

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        arrWithNewPopulation = [];
    });

    test('- there are differences between new and old data', () => {
        arrWithNewPopulation = newTableWithStatesFromAPI.tableAfterComparison;
        newTableWithStatesFromAPI.infoAboutChangingPopulation(oldData1,newData);
        // console.log('==arrWithNewPopulation1.length==', arrWithNewPopulation, arrWithNewPopulation[0]);
        expect(arrWithNewPopulation.length).toBe(1);
        expect(arrWithNewPopulation.some((el: any) => el === 'Angola')).toBe(true);
    });

    test('- there are NOT differences between new and old data', () => {
        arrWithNewPopulation = newTableWithStatesFromAPI.tableAfterComparison;
        newTableWithStatesFromAPI.infoAboutChangingPopulation(oldData2,newData);
        // console.log('==arrWithNewPopulation1.length==', arrWithNewPopulation, arrWithNewPopulation[0]);
        expect(arrWithNewPopulation.length).toBe(0);
        expect(arrWithNewPopulation[0]).toBe(undefined);
    });

})

describe('Tests class TableWithStates. Check, ', () => {
    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
    });

    test('if app can select only EU countries:', () => {
        const onlyEU = newTableWithStatesFromAPI.getEuStates(mockValues.states4);
        tableWithStatesEU = new TableWithStatesEU(onlyEU);
        // console.log('====po selekcji, tylko UE:', onlyEU);
        // console.log('====państwa przekazane do nowej instancji:', tableWithStatesEU.states);

        expect(onlyEU.length).toEqual(4);
        expect(onlyEU.findIndex((el: any) => el.name === 'Poland')).toBeGreaterThanOrEqual(0);
        expect(onlyEU[1].name).toEqual(tableWithStatesEU.states[1].name);        
    });
})


// tests for class StorageBrowser
describe('Tests class StorageBrowser. Check,', () => {
    let keyObject = mockValues.obj.key;
    let resultObject = mockValues.obj.res;
    let keyArray = mockValues.arr.key;
    let resultArray = mockValues.arr.res;
    let keyNumber = mockValues.num.key;
    let resultNumber = mockValues.num.res;
    let keyEmpty = mockValues.empty.key;
    let resultEmpty = mockValues.empty.res;

    beforeEach(() => {
        newStorage = new StorageBrowser();
    });

    afterEach(() => {
        newStorage = null;
    });

    test('if new object is created as instance of StorageBrowser', () => {
        expect(newStorage).toBeInstanceOf(StorageBrowser);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for objects', () => {
        newStorage.saveStorage(keyObject, resultObject);
        let testObjectFromStorage = newStorage.getStorage(keyObject);
        expect(testObjectFromStorage.findIndex((el:any) => el.surname === 'ipsum')).toBeLessThan(0);
        expect(testObjectFromStorage.some((el:any) => el.id === 321)).toBe(true);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for numbers', () => {
        newStorage.saveStorage(keyNumber, resultNumber);
        let testNumberFromStorage = newStorage.getStorage(keyNumber);
        expect(testNumberFromStorage).toBe(12345);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for null', () => {
        newStorage.saveStorage(keyEmpty, resultEmpty);
        let testEmptyFromStorage = newStorage.getStorage(keyEmpty);
        expect(testEmptyFromStorage).toBe(resultEmpty);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for arrays', () => {
        newStorage.saveStorage(keyArray, resultArray);
        let testArrayFromStorage = newStorage.getStorage(keyArray);
        expect(testArrayFromStorage.length).toEqual(5);
        expect(testArrayFromStorage).toContain('meksyk');
        expect(testArrayFromStorage).not.toContain('ekwador');
    });
});

// tests for class TableWithStatesEU
let tableWithStatesEU: any = null;
 
describe('Tests class TableWithStatesEU. Check,', () => {
    beforeEach(() => {
        tableWithStatesEU = new TableWithStatesEU(mockValues.states4);
    });

    afterEach(() => {
        tableWithStatesEU = null;
    });

    test('if new object is created as instance of TableWithStatesEU ', () => {
        expect(tableWithStatesEU).toBeInstanceOf(TableWithStatesEU);
        // console.log(tableWithStatesEU)
    });
})