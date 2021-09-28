import { TableWithStates, StorageBrowser } from './index';

// test for class TableWithStates
describe('Check', () => {
    let newTableWithStatesFromAPI: any = null;

    beforeEach(() => {
        return newTableWithStatesFromAPI = new TableWithStates();
    });

    afterEach(() => {
        return newTableWithStatesFromAPI = null;
    });
    
    test('if new object is created as instance of TableWithStates', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });
});

// test for class StorageBrowser
describe('Check', () => {
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
