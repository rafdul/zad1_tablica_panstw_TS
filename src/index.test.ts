import { TableWithStates, StorageBrowser } from './index';

// "start"-tests
test('5 is equal to 5', () => {
    expect(5).toBe(5);
});

test('3 is equal to 2', () => {
    expect(3).not.toBe(2);
});

// test for class TableWithStates
describe('Check', () => {
    const newTableWithStatesFromAPI = new TableWithStates();
    
    test('if newTableWithStatesFromAPI is instance of TableWithStates', () => {
        expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
    });
});

// test for class StorageBrowser
describe('Check', () => {
    // const newStorage = new StorageBrowser();
    let keyObject: string = 'testObject';
    let resultObject: {}[] = [{name: 'lorem', surname: 'ipsum', id: 1}, {name: 'adam', surname: 'mickiewicz', id: 2}];
    let keyNumber: string = 'testNumber';
    let resultNumber: number = 12345;
    let keyEmpty: string = 'testEmpty';
    let resultEmpty: any = null;

    test('if newStorage is instance of StorageBrowser', () => {
        const newStorage = new StorageBrowser();
        expect(newStorage).toBeInstanceOf(StorageBrowser);
    })

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for objects', () => {
        const newStorage = new StorageBrowser();
        newStorage.saveStorage(keyObject, resultObject);
        let testObjectFromStorage = newStorage.getStorage(keyObject);
        expect(testObjectFromStorage[0].surname).toBe('ipsum');
        expect(testObjectFromStorage[1].id).toBe(2);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for number', () => {
        const newStorage = new StorageBrowser();
        newStorage.saveStorage(keyNumber, resultNumber);
        let testNumberFromStorage = newStorage.getStorage(keyNumber);
        expect(testNumberFromStorage).toBe(12345);
    });

    test('if methods for setting (saveStorage) and getting of localStorage (getStorage) are working for null', () => {
        const newStorage = new StorageBrowser();
        newStorage.saveStorage(keyEmpty, resultEmpty);
        let testEmptyFromStorage = newStorage.getStorage(keyEmpty);
        expect(testEmptyFromStorage).toBe(resultEmpty);
        // expect(typeof testEmptyFromStorage).toBe(null);
    });
});
