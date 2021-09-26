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

test('newStorage is instance of StorageBrowser', () => {
    const newStorage = new StorageBrowser();
    expect(newStorage).toBeInstanceOf(StorageBrowser);
})