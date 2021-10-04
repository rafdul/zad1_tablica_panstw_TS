import { TableWithStates, StorageBrowser } from './index';
import { mockValues } from './mocks'

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;
let fromStorage: any = null;
let fromAPI: any = null;
let downloadFromApiAgain: string = '';

function mockFunc(): void {
    newTableWithStatesFromAPI.init = (): void => {
        if(downloadFromApiAgain === 'storage' && newStorage.getStorage('states').length > 0) {
            return fromStorage;
        } else {
            return fromAPI;
        }
    }
}

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