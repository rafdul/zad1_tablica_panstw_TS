import { TableWithStates, StorageBrowser, TableWithStatesEU } from './index';
import { mockValues, TabWithStates } from './mocks'

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
    let statesEU: [] | Array<TabWithStates> = [];

    beforeEach(() => {
        tableWithStatesEU = new TableWithStatesEU(mockValues.states4);
        statesEU = tableWithStatesEU.states;
    });

    afterEach(() => {
        tableWithStatesEU = null;
        statesEU = [];
    });

    test('if new object is created as instance of TableWithStatesEU ', () => {
        expect(tableWithStatesEU).toBeInstanceOf(TableWithStatesEU);
        // console.log(tableWithStatesEU)
    });

    test('if density is added', () => {
        tableWithStatesEU.addDensityAndSort(statesEU);

        expect(statesEU.filter((el: any) => !el.density)).toStrictEqual([]);
        expect(typeof statesEU[2].density).toBe('number');
        expect(statesEU[2].density).toBeGreaterThan(0);
    });

    test('if addDensityAndSort calls other methods', () => {
        tableWithStatesEU.compareStates = jest.fn();
        tableWithStatesEU.removeLetterA = jest.fn();
        tableWithStatesEU.countPopulationForAFewStatesEu = jest.fn();

        tableWithStatesEU.addDensityAndSort(statesEU);

        expect(tableWithStatesEU.compareStates).toHaveBeenCalledTimes(1);
        expect(tableWithStatesEU.removeLetterA).toHaveBeenCalledTimes(1);
        expect(tableWithStatesEU.countPopulationForAFewStatesEu).toHaveBeenCalledTimes(1);
    });

    test('if states were sorted by density', () => {
        const testStates = mockValues.statesWithDensity;
        tableWithStatesEU.compareStates(testStates, 'density');
        
        expect(testStates.length).toEqual(4);
        expect(testStates[0].name).toEqual('Netherlands');

        if(testStates[0].density != undefined && testStates[1].density != undefined && testStates[2].density != undefined && testStates[3].density != undefined) {
            let diff1 = (testStates[0].density) - (testStates[1].density);
            let diff2 = (testStates[3].density) - (testStates[2].density);
            expect(diff1).toBeGreaterThan(0);
            expect(diff2).toBeLessThan(0);
        }
    });

    test('if letter "a" was removed from name of countries', () => {
        const testStates = mockValues.states4;;
        tableWithStatesEU.removeLetterA(testStates, 'a');

        expect(tableWithStatesEU.tableStatesWithoutLetterA.length).toEqual(2);
        expect(tableWithStatesEU.tableStatesWithoutLetterA.some((el: any) => el.name === 'Belgium')).toBe(true);
    });

    test('if app can sum population of countries', () => {
        const testStates = mockValues.statesWithDensity;
        const populationTop2FromTestStates = 28140035;
        let res = tableWithStatesEU.countPopulationForAFewStatesEu(testStates, 2)

        expect(res).toEqual(populationTop2FromTestStates);
    });
})