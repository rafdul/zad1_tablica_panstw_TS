import { TableWithStates } from './tableWithStates';
import { StorageBrowser } from './storage';
import { TableWithStatesEU } from './tableWithStatesEU';
import { mockValues } from './mocks'
import { TabWithStates, logsTexts } from './config';

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;
let tableWithStatesEU: any = null;

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

    test('if function infoAboutChangingPopulation is called when there are data in storage', () => {
        let dataFromAPI = mockValues.states0;
        newStorage.saveStorage('states', dataFromAPI)
        newTableWithStatesFromAPI.infoAboutChangingPopulation = jest.fn();

        newTableWithStatesFromAPI.transferDataFromAPI(dataFromAPI)

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

    let arrVariants = [
        {a: number6Days, expected: 'api'}, 
        {a: numberGreaterThan6Days, expected: 'api'}, 
        {a: notNumber, expected: 'api'},
        {a: numberLess6Days_1ms, expected: 'storage'},
        {a: numberLess6Days2_nearly6Days, expected: 'storage'},
        {a: numberLess6Days3_1s, expected: 'storage'},
    ]

    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
    });

    test.each(arrVariants)(`test of different variants`, ({a, expected}) => {
        expect(newTableWithStatesFromAPI.downloadFromApiAgain(a)).toBe(expected);
    });
})

describe('Tests class TableWithStates. Check, if app can compare population between new and old data:', () => {
    let arrWithNewPopulation: Array<{}> = [];
    const newData = mockValues.states0;
    const oldData1 = mockValues.states3;
    const oldData2 = mockValues.states1;

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
        console.log('==arrWithNewPopulation1.length==', arrWithNewPopulation, arrWithNewPopulation[0]);
        expect(arrWithNewPopulation.length).toBe(1);
        expect(arrWithNewPopulation.some((el: any) => el === 'Angola')).toBe(true);
    });

    test('- there are NOT differences between new and old data', () => {
        arrWithNewPopulation = newTableWithStatesFromAPI.tableAfterComparison;
        newTableWithStatesFromAPI.infoAboutChangingPopulation(oldData2,newData);
        // console.log('==arrWithNewPopulation1.length==', arrWithNewPopulation, arrWithNewPopulation[0]);
        expect(arrWithNewPopulation.length).toBe(0);
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
        const onlyEU = newTableWithStatesFromAPI.selectStatesByBlock(mockValues.states4, 'EU');
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
        let keyObject = mockValues.obj.key;
        let resultObject = mockValues.obj.res;

        newStorage.saveStorage(keyObject, resultObject);
        let testObjectFromStorage = newStorage.getStorage(keyObject);

        expect(testObjectFromStorage.findIndex((el:any) => el.surname === 'ipsum')).toBeLessThan(0);
        expect(testObjectFromStorage.some((el:any) => el.id === 321)).toBe(true);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for numbers', () => {
        let keyNumber = mockValues.num.key;
        let resultNumber = mockValues.num.res;

        newStorage.saveStorage(keyNumber, resultNumber);
        let testNumberFromStorage = newStorage.getStorage(keyNumber);

        expect(testNumberFromStorage).toBe(12345);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for null', () => {
        let keyEmpty = mockValues.empty.key;
        let resultEmpty = mockValues.empty.res;

        newStorage.saveStorage(keyEmpty, resultEmpty);
        let testEmptyFromStorage = newStorage.getStorage(keyEmpty);

        expect(testEmptyFromStorage).toBe(resultEmpty);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for arrays', () => {
        let keyArray = mockValues.arr.key;
        let resultArray = mockValues.arr.res;

        newStorage.saveStorage(keyArray, resultArray);
        let testArrayFromStorage = newStorage.getStorage(keyArray);

        expect(testArrayFromStorage.length).toEqual(5);
        expect(testArrayFromStorage).toContain('meksyk');
        expect(testArrayFromStorage).not.toContain('ekwador');
    });
});

// tests for class TableWithStatesEU 
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
        tableWithStatesEU.addDensity(statesEU);

        expect(statesEU.filter((el: any) => !el.density)).toStrictEqual([]);
        expect(typeof statesEU[2].density).toBe('number');
        expect(statesEU[2].density).toBeGreaterThan(0);
    });

    test('if states were sorted by density', () => {
        tableWithStatesEU.compareStates(statesEU, 'density');
        // console.log('============tableWithStatesEU.states======', tableWithStatesEU.states)
       
        expect(tableWithStatesEU.states.length).toEqual(6);
        expect(tableWithStatesEU.states[0].name).toEqual('Malta');
        expect(tableWithStatesEU.states[0].density).toBeGreaterThan(tableWithStatesEU.states[1].density);
        expect(tableWithStatesEU.states[5].density).toBeLessThan(tableWithStatesEU.states[4].density);
    });

    test('if app can remove indicated letter from name of countries', () => {
        const testStatesM = mockValues.states2;
        let withoutLetter = tableWithStatesEU.tableStatesWithoutIndicatedLetter;

        tableWithStatesEU.removeLetterFromName(testStatesM, 'm');

        expect(withoutLetter.length).toEqual(2);
        // expect(withoutLetter.some((el: any) => el.name === 'Kenia')).toBe(true);
        expect(withoutLetter.every((el: any) => el.name.includes('m') === false)).toBe(true);
    });

    // test('if app can sum population of countries', () => {
    //     const testStates = mockValues.statesWithPopulation;
    //     const testStatesPopulationTop2 = 21052338;
    //     const testStatesPopulationTop3 = 38493477;

    //     let resTop2 = tableWithStatesEU.countEUPopulation(testStates, 2);
    //     let resTop3 = tableWithStatesEU.countEUPopulation(testStates, 3)

    //     expect(resTop2).toEqual(testStatesPopulationTop2);
    //     expect(resTop3).toEqual(testStatesPopulationTop3);
    //     expect(resTop2).toBeLessThan(resTop3);
    // });



    test('if app called correct information in console.log when sum of pupulation less than 50M', () => {
        const testStates = mockValues.statesWithPopulation;
        const testStatesPopulationTop2 = 28140035;
        const expectedText = logsTexts.tableWithStatesEU.countEUPopulation.prelude + 2 + logsTexts.tableWithStatesEU.countEUPopulation.lessThan + testStatesPopulationTop2.toString() + logsTexts.tableWithStatesEU.countEUPopulation.infoAboutStates + 'Netherlands, Czech Republic'
        console.log = jest.fn();

        tableWithStatesEU.countEUPopulation(testStates, 2);

        expect(console.log).toHaveBeenCalledWith(expectedText);
    });

    test('if app called correct information in console.log when sum of pupulation more than 500M', () => {
        const testStates = mockValues.statesWithPopulation;
        const testStatesPopulationTop3 = 1399090837;
        const expectedText = logsTexts.tableWithStatesEU.countEUPopulation.prelude + 3 + logsTexts.tableWithStatesEU.countEUPopulation.moreThan + testStatesPopulationTop3.toString() + logsTexts.tableWithStatesEU.countEUPopulation.infoAboutStates + 'Netherlands, Czech Republic, China'
        console.log = jest.fn();

        tableWithStatesEU.countEUPopulation(testStates, 3);
        
        expect(console.log).toHaveBeenCalledWith(expectedText)
    });
})