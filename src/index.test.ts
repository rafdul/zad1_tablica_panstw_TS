import { TableWithStates, StorageBrowser } from './index';

// "start"-tests
test('5 is equal to 5', () => {
    expect(5).toBe(5);
});

test('3 is equal to 2', () => {
    expect(3).not.toBe(2);
});

// test for index.ts
test('newTableWithStatesFromAPI is instance of TableWithStates', () => {
    const newTableWithStatesFromAPI = new TableWithStates();
    expect(newTableWithStatesFromAPI).toBeInstanceOf(TableWithStates);
})

describe('newStorage', () => {
    const newStorage = new StorageBrowser();
    let keyObject: string = 'testObject';
    let resultObject: {}[] = [{name: 'lorem', surname: 'ipsum', id: 1}, {name: 'adam', surname: 'mickiewicz', id: 2}];
    let keyNumber: string = 'testNumber';
    let resultNumber: number = 12345;
    let keyEmpty: string = 'testEmpty';
    let resultEmpty: any = null;
    let keyUndefined: string = 'testUndefined';
    let resultUndefined: any = undefined;

    // console.log('newStorage', newStorage);

    test('is instance of StorageBrowser', () => {
        expect(newStorage).toBeInstanceOf(StorageBrowser);
    })

    test('has method for setting (saveStorage) and getting of localStorage (getStorage)', () => {
        newStorage.saveStorage(keyObject, resultObject);
        let testObjectFromStorage = newStorage.getStorage(keyObject);
        expect(testObjectFromStorage[0].surname).toBe('ipsum');
        expect(testObjectFromStorage[1].id).toBe(2);

        newStorage.saveStorage(keyNumber, resultNumber);
        let testNumberFromStorage = newStorage.getStorage(keyNumber);
        expect(testNumberFromStorage.length).toBe(1);
        expect(testNumberFromStorage[0]).toBe(resultNumber);

        newStorage.saveStorage(keyEmpty, resultEmpty);
        let testEmptyFromStorage = newStorage.getStorage(keyEmpty);
        expect(Array.isArray(testEmptyFromStorage)).toBeTruthy();
        expect(testEmptyFromStorage.length).toBe(0);

        newStorage.saveStorage(keyUndefined, resultUndefined);
        let testUndefinedFromStorage = newStorage.getStorage(keyUndefined);
        expect(Array.isArray(testUndefinedFromStorage)).toBeTruthy();
        expect(testUndefinedFromStorage.length).toBe(0);
    });
})
