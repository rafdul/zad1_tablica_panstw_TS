// global.fetch = require('jest-fetch-mock');
import fetchMock from "jest-fetch-mock"

import { TableWithStates, StorageBrowser } from './index';

// test for class TableWithStates
describe('Tests class TableWithStates. Check,', () => {
    let newTableWithStatesFromAPI: any = null;
    let newStorage: any = null;
    const url: string = "https://restcountries.com/v3/all";
    let dateDownloadFromApi: number = 0;
    let tableAfterComparison: Array<{}> = [];
    const states = [{id: 1, name: 'Angola', population: 10000000}, {id: 2, name: 'Bostwana', population: 5000000}, {id: 3, name: 'Kenia', population: 50000000}]


    beforeEach(() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();
        fetchMock.resetMocks()
    });

    afterEach(() => {
        newTableWithStatesFromAPI = null;
        newStorage = null
    });
    
    test('if new object is created as instance of TableWithStates', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });

});

describe('Tests class TableWithStates. Check, if app use local storage or API again:', () => {
    let newTableWithStatesFromAPI: any = null;
    const MS_IN_6DAYS: number = 6*24*60*60*1000;
    const MS_FOR_TEST: number = 30*1000;
    const timeNow: number = (new Date).getTime();

    let number6Days: number = timeNow - MS_IN_6DAYS;
    let numberGreaterThan6Days: number = timeNow - MS_IN_6DAYS - 1;
    let numberLess6Days: number = timeNow - 1;
    let numberLess6Days2: number = timeNow - MS_IN_6DAYS + 1000;
    let numberLess6Days3: number = timeNow - 1000;
    let notNumber: null = null;

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

describe('Tests class TableWithStates. Check, if app compares population between new and old data:', () => {
    let newTableWithStatesFromAPI: any = null;
    let arrWithNewPopulation: Array<{}> = [];
    const newData: Array<{}> = [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}];
    const oldData1: Array<{}>  = [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 9000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}];
    const oldData2: Array<{}>  = [{id: 1, alpha3Code: 'ANG', name: 'Angola', population: 10000000}, {id: 2, alpha3Code: 'BOS', name: 'Bostwana', population: 5000000}, {id: 3, alpha3Code: 'KEN', name: 'Kenia', population: 50000000}];


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
    let keyObject: string = 'testObject';
    let resultObject: {}[] = [{name: 'lorem', surname: 'ipsum', id: 1}, {name: 'adam', surname: 'mickiewicz', id: 2}];
    let keyArray: string = 'testArray';
    let resultArray: string[] = ['miłosz', 'szymborska', 'sienkiewicz', 'wyspiański', 'tokarczuk'];
    let keyNumber: string = 'testNumber';
    let resultNumber: number = 12345;
    let keyEmpty: string = 'testEmpty';
    let resultEmpty: any = null;
    let newStorage: any = null;

    beforeEach(() => {
        return newStorage = new StorageBrowser();
    });

    afterEach(() => {
        return newStorage = null;
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

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for number', () => {
        newStorage.saveStorage(keyNumber, resultNumber);
        let testNumberFromStorage = newStorage.getStorage(keyNumber);
        expect(testNumberFromStorage).toBe(12345);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for null', () => {
        newStorage.saveStorage(keyEmpty, resultEmpty);
        let testEmptyFromStorage = newStorage.getStorage(keyEmpty);
        expect(testEmptyFromStorage).toBe(resultEmpty);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for array', () => {
        newStorage.saveStorage(keyArray, resultArray);
        let testArrayFromStorage = newStorage.getStorage(keyArray);
        expect(testArrayFromStorage.length).toEqual(5);
        expect(testArrayFromStorage).toContain('szymborska');
        expect(testArrayFromStorage).not.toContain('herbert');
    });
});
