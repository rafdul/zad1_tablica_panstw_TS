import { TableWithStates, StorageBrowser } from './index';

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;
let fromStorage: any = null;
let fromAPI: any = null;
let downloadFromApiAgain: string = '';
const MS_IN_6DAYS: number = 6*24*60*60*1000;
const MS_FOR_TEST: number = 30*1000;
const timeNow: number = (new Date).getTime();

interface Values {
    states0: Array<{}>,
    states1: Array<{}>,
    states2: Array<{}>,
    states3: Array<{}>,
    obj: {key: string, res: {}[]},
    arr: {key: string, res: string[]},
    num: {key: string, res: number},
    empty: {key: string, res: null},
    time: {number6Days: number, numberGreaterThan6Days: number, numberLess6Days: number, numberLess6Days2: number, numberLess6Days3: number, notNumber: null},
}

const mockValues: Values = {
    states0: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}],
    states1: [{id: 1, alpha3Code: 'BEN', name: 'Benin', population: 1000000}, {id: 2, alpha3Code: 'RWA', name: 'Rwanda', population: 5500000}, {id: 3, alpha3Code: 'UGA', name: 'Uganda', population: 70000000}],
    states2: [{id: 1, alpha3Code: 'MON', name: 'Monaco', population: 800000}, {id: 2, alpha3Code: 'SAN', name: 'San Marino', population: 49000},],
    states3: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}],
    obj: {key: 'testObject', res: [{name: 'lorem', surname: 'ipsum', id: 1}, {name: 'adam', surname: 'mickiewicz', id: 2}]},
    arr: {key: 'testArray', res: ['miłosz', 'szymborska', 'sienkiewicz', 'wyspiański', 'tokarczuk']},
    num: {key: 'testNumber', res: 12345},
    empty: {key: 'testEmpty', res: null},
    time: {
        number6Days: timeNow - MS_IN_6DAYS, 
        numberGreaterThan6Days: timeNow - MS_IN_6DAYS - 1, 
        numberLess6Days: timeNow - 1, 
        numberLess6Days2: timeNow - MS_IN_6DAYS + 1000, 
        numberLess6Days3: timeNow - 1000, 
        notNumber: null,
    },
}


// test for class TableWithStates
describe('Tests class TableWithStates. Check,', () => {
    const states: Array<{}> = mockValues.states0;
    const unmockedFetch: any = global.fetch;

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
        
        global.fetch = (): any => Promise.resolve({
            json: () => Promise.resolve(states),
        })
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        global.fetch = unmockedFetch;
    });
    
    test('if new object is created as instance of TableWithStates', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });

    test('if app can connect with API (fetch in downloadFromAPI)', async () => {
        try{
            const response = await fetch(JSON.stringify(states));
            const responseJson = await response.json();
            console.log('{{{{{{{{{{z api}}}}}}}}}}:', typeof responseJson, 'lenght:', responseJson.length);

            expect(Array.isArray(responseJson)).toEqual(true);
            expect(responseJson.length).toEqual(3);
            expect(responseJson[2].name).toEqual('Kenia');

        } catch(err) {
            console.log(err);
        }
    });
});

describe('Tests class TableWithStates. Check, if app use local storage or API again:', () => {
    let number6Days = mockValues.time.number6Days;
    let numberGreaterThan6Days = mockValues.time.numberGreaterThan6Days;
    let numberLess6Days = mockValues.time.numberLess6Days;
    let numberLess6Days2 = mockValues.time.numberLess6Days2;
    let numberLess6Days3 = mockValues.time.numberLess6Days3;
    let notNumber = null;

    let arrApi = [number6Days, numberGreaterThan6Days, notNumber];
    let arrStorage = [numberLess6Days, numberLess6Days2, numberLess6Days3]

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
    });

    test('- app should choose API', () => {
        for(let i=0; i<arrApi.length; i++) {
            // console.log('+++storage+++', arrApi[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i]))
            expect(newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i])).toBe('api')
        }
    })

    test('- app should choose local storage', () => {
        for(let i=0; i<arrStorage.length; i++) {
            // console.log('====storage===', arrStorage[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrStorage[i]))
            expect(newTableWithStatesFromAPI.downloadFromApiAgain(arrStorage[i])).toBe('storage')
        }
    })
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
        expect(arrWithNewPopulation[0]).toBe('Angola');
    })

    test('- there are NOT differences between new and old data', () => {
        arrWithNewPopulation = newTableWithStatesFromAPI.tableAfterComparison;
        newTableWithStatesFromAPI.infoAboutChangingPopulation(oldData2,newData);
        
        // console.log('==arrWithNewPopulation1.length==', arrWithNewPopulation, arrWithNewPopulation[0]);
        expect(arrWithNewPopulation.length).toBe(0);
        expect(arrWithNewPopulation[0]).toBe(undefined);
    })

})

// test for class StorageBrowser
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
    })

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for objects', () => {
        newStorage.saveStorage(keyObject, resultObject);
        let testObjectFromStorage = newStorage.getStorage(keyObject);
        expect(testObjectFromStorage[0].surname).toEqual('ipsum');
        expect(testObjectFromStorage[1].id).toEqual(2);
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
        expect(testArrayFromStorage).toContain('szymborska');
        expect(testArrayFromStorage).not.toContain('herbert');
    });
});

describe('Scenario:', () => {
    beforeEach( async() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();

        fromStorage = newStorage.getStorage('states');
        newTableWithStatesFromAPI.downloadFromAPI = () => mockValues.states1;
        fromAPI = newTableWithStatesFromAPI.downloadFromAPI();
        
        newTableWithStatesFromAPI.init = () => {
            if(downloadFromApiAgain === 'storage' && newStorage.getStorage('states').length > 0) {
                return fromStorage;
            } else {
                return fromAPI;
            }
        }
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
        fromAPI = null;
        fromStorage = null;
    });

    test('1. simulate first start, local storage is empty (app have to use API)', () => {
        newTableWithStatesFromAPI.init();
        expect(fromStorage).toEqual(null);
        expect(fromAPI.length).toEqual(3);
    })
})

describe('Next scenarios:', () => {
    beforeEach( async() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();

        newStorage.saveStorage('states', mockValues.states2);
        fromStorage = newStorage.getStorage('states');
        newTableWithStatesFromAPI.downloadFromAPI = () => mockValues.states1;
        fromAPI = newTableWithStatesFromAPI.downloadFromAPI();

        newTableWithStatesFromAPI.init = () => {
            if(downloadFromApiAgain === 'storage' && newStorage.getStorage('states').length > 0) {
                return fromStorage;
            } else {
                return fromAPI;
            }
        }
    })

    afterEach( async() => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
        fromAPI = null;
        fromStorage = null;
    })

    test('2. simulate using API (there are states in local storage, but these are old data)', () => {
        downloadFromApiAgain = 'api';
        let init = newTableWithStatesFromAPI.init();
        // console.log('=====init--2======',init);
        
        expect(init.length).toEqual(3);
        expect(init[1].alpha3Code).toEqual('RWA');
    })

    test('3. simulate using local storage ', () => {
        downloadFromApiAgain = 'storage';
        let init = newTableWithStatesFromAPI.init();
        // console.log('=====init--2======',init);
        
        expect(init.length).toEqual(2);
        expect(init[0].alpha3Code).toEqual('MON');
    })
})
