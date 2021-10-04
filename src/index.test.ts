import { TableWithStates, StorageBrowser, TableWithStatesEU } from './index';

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;
let fromStorage: any = null;
let fromAPI: any = null;
let downloadFromApiAgain: string = '';
const MS_IN_6DAYS: number = 6*24*60*60*1000;
// const MS_IN_6DAYS: number = 30*1000;
const timeNow: number = (new Date).getTime();

interface TabWithStates {
    name: string,
    population: number,
    area?: number,
    density?: number,
    id?: number,
    alpha3Code?: string,
};

interface Values {
    states0: Array<TabWithStates>,
    states1: Array<TabWithStates>,
    states2: Array<TabWithStates>,
    states3: Array<TabWithStates>,
    states4: Array<TabWithStates>
    obj: {key: string, res: {}[]},
    arr: {key: string, res: string[]},
    num: {key: string, res: number},
    empty: {key: string, res: null},
    time: {
        number6Days: number, 
        numberGreaterThan6Days: number, 
        numberLess6Days: number, 
        numberLess6Days2: number, 
        numberLess6Days3: number, 
        notNumber: null,
    },
}

const mockValues: Values = {
    states0: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}],
    states1: [{id: 1, alpha3Code: 'BEN', name: 'Benin', population: 1000000}, {id: 2, alpha3Code: 'RWA', name: 'Rwanda', population: 5500000}, {id: 3, alpha3Code: 'UGA', name: 'Uganda', population: 70000000}],
    states2: [{id: 1, alpha3Code: 'MON', name: 'Monaco', population: 800000}, {id: 2, alpha3Code: 'SAN', name: 'San Marino', population: 49000},],
    states3: [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}],
    states4: [{name: 'Burkina', population: 9000000, area: 67540}, {name: 'Surinam', population: 880000, area: 6754}, {name: 'Malta', population: 213000, area: 645}, {name: 'Poland', population: 33000000, area: 450000}, {name: 'Greece', population: 8000000, area: 187000}, {name: 'Belgium', population: 11000000, area: 120000}],
    obj: {key: 'testObject', res: [{name: 'lorem', surname: 'ipsum', id: 1}, {name: 'adam', surname: 'mickiewicz', id: 2}]},
    arr: {key: 'testArray', res: ['miłosz', 'szymborska', 'sienkiewicz', 'wyspiański', 'tokarczuk']},
    num: {key: 'testNumber', res: 12345},
    empty: {key: 'testEmpty', res: null},
    time: {
        number6Days: (timeNow - MS_IN_6DAYS), 
        numberGreaterThan6Days: (timeNow - MS_IN_6DAYS - 1), 
        numberLess6Days: (timeNow - 1), 
        numberLess6Days2: (timeNow - MS_IN_6DAYS + 1000), 
        numberLess6Days3: (timeNow - 1000), 
        notNumber: null,
    },
}

function mockFunc(): void {
    newTableWithStatesFromAPI.init = (): void => {
        if(downloadFromApiAgain === 'storage' && newStorage.getStorage('states').length > 0) {
            return fromStorage;
        } else {
            return fromAPI;
        }
    }
}

// tests for class TableWithStates
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
    
    test('if new object is created as instance of TableWithStates ', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });

    test('if app can connect with API (fetch in downloadFromAPI)', async () => {
        try{
            const response = await fetch(JSON.stringify(states));
            const responseJson = await response.json();
            // console.log('{{{{{{{{{{z api}}}}}}}}}}:', typeof responseJson, 'lenght:', responseJson.length);
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
            console.log('====api===', arrApi[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i]))
            expect(newTableWithStatesFromAPI.downloadFromApiAgain(arrApi[i])).toBe('api')
        }
    })

    test('- app should choose local storage', () => {
        for(let i=0; i<arrStorage.length; i++) {
            console.log('====storage===', arrStorage[i], newTableWithStatesFromAPI.downloadFromApiAgain(arrStorage[i]))
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
        // console.log('///////po selekcji, tylko UE:////////', onlyEU);
        // console.log('///////państwa przekazane do nowej instancji:////////', tableWithStatesEU.states);

        expect(onlyEU.length).toEqual(4);
        expect(onlyEU[1].name).toEqual('Poland');
        expect(onlyEU[1].name).toEqual(tableWithStatesEU.states[1].name);
    })
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

// tests for app' start in different situation 
describe('Scenario:', () => {
    beforeEach( async() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();

        fromStorage = newStorage.getStorage('states');
        newTableWithStatesFromAPI.downloadFromAPI = () => mockValues.states1;
        fromAPI = newTableWithStatesFromAPI.downloadFromAPI();
        mockFunc()
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
        fromAPI = null;
        fromStorage = null;
    });

    test('1. simulate first start, local storage is empty (app have to use API)', () => {
        let init = newTableWithStatesFromAPI.init();
        // console.log('=====init--scen1======',init);
        // console.log('=====local--scen1======',newStorage.getStorage('states'));
        expect(fromStorage).toEqual(null);
        expect(init.length).toEqual(3);
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
        mockFunc()
    })

    afterEach( () => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
        fromAPI = null;
        fromStorage = null;
    })

    test('2. simulate start with using API (there are states in local storage, but these are old data)', () => {
        downloadFromApiAgain = 'api';
        let init = newTableWithStatesFromAPI.init();
        // console.log('=====init--scen2======',init);
        // console.log('=====local--scen2======',newStorage.getStorage('states'));
        expect(init.length).toEqual(3);
        expect(init[1].alpha3Code).toEqual('RWA');
    })

    test('3. simulate start with using local storage (there are states in local storage and these data are quite new)', () => {
        downloadFromApiAgain = 'storage';
        let init = newTableWithStatesFromAPI.init();
        // console.log('=====init--scen3======',init );
        // console.log('=====local--scen3======',newStorage.getStorage('states'));
        expect(init.length).toEqual(2);
        expect(init[0].alpha3Code).toEqual('MON');
        expect(init[1].population).toEqual(49000);
    })
})

// tests for class TableWithStatesEU
let tableWithStatesEU: any = null;
 
describe('Tests class TableWithStatesEU. Check,', () => {
    beforeEach(() => {
        tableWithStatesEU = new TableWithStatesEU(mockValues.states4);
    })

    afterEach(() => {
        tableWithStatesEU = null;
    })

    test('if new object is created as instance of TableWithStatesEU ', () => {
        expect(tableWithStatesEU).toBeInstanceOf(TableWithStatesEU);
        // console.log(tableWithStatesEU)
    });
})