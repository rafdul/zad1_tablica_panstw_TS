import { TableWithStates, StorageBrowser } from './index';
import { mockValues } from './mocks';
import { MS_IN_6DAYS } from './config';

let newTableWithStatesFromAPI: any = null;
let newStorage: any = null;

describe(`Different scenarios of app's init:`, () => {
    beforeEach( async() => {
        newTableWithStatesFromAPI = new TableWithStates();
        newStorage = new StorageBrowser();
    });

    afterEach( () => {
        newTableWithStatesFromAPI = null;
        newStorage = null;
    });

    test('- simulate first start, local storage is empty (app have to use API)', () => {
        newStorage.getStorage('states');
        newStorage.getStorage('date');
        // console.log('flaga ze stora',newTableWithStatesFromAPI.downloadFromApiAgain(newStorage.getStorage('date')), ' długość tablicy w store ', newStorage.getStorage('states'))
        
        newTableWithStatesFromAPI.downloadFromAPI = jest.fn()
        newTableWithStatesFromAPI.getEuStates = jest.fn()
        
        newTableWithStatesFromAPI.init();

        expect(newTableWithStatesFromAPI.downloadFromAPI).toBeCalledTimes(1)
        expect(newTableWithStatesFromAPI.getEuStates).not.toBeCalled()
        expect(newTableWithStatesFromAPI.getEuStates).toBeCalledTimes(0)
        // expect(newTableWithStatesFromAPI.tableStatesFromApi.length).toEqual(3);
        // expect(newTableWithStatesFromAPI.tableStatesFromApi.some((el: any) => el.name === 'Angola')).toBe(true);
    });

    test('- simulate start with using local storage (there are states in local storage and these data are quite new)', () => {
        newStorage.saveStorage('states', mockValues.states2);
        newStorage.saveStorage('date', ((new Date).getTime() - 10*1000));
        // console.log('flaga ze stora',newTableWithStatesFromAPI.downloadFromApiAgain(newStorage.getStorage('date')), ' długość tablicy w store ', newStorage.getStorage('states').length)
        
        newTableWithStatesFromAPI.downloadFromAPI = jest.fn()
        newTableWithStatesFromAPI.getEuStates = jest.fn()

        newTableWithStatesFromAPI.init();

        expect(newTableWithStatesFromAPI.downloadFromAPI).toBeCalledTimes(0)
        expect(newTableWithStatesFromAPI.getEuStates).toBeCalledTimes(1)
        expect(newTableWithStatesFromAPI.downloadFromAPI).not.toBeCalled()
    });

    test('- simulate start with using API (there are states in local storage, but these are old data)', () => {
        newStorage.saveStorage('states', mockValues.states2);
        newStorage.saveStorage('date', ((new Date).getTime() - MS_IN_6DAYS));
        // console.log('flaga ze stora',newTableWithStatesFromAPI.downloadFromApiAgain(newStorage.getStorage('date')), ' długość tablicy w store ', newStorage.getStorage('states').length)
        
        newTableWithStatesFromAPI.downloadFromAPI = jest.fn()
        newTableWithStatesFromAPI.getEuStates = jest.fn()

        newTableWithStatesFromAPI.init();

        expect(newTableWithStatesFromAPI.downloadFromAPI).toBeCalledTimes(1)
        expect(newTableWithStatesFromAPI.getEuStates).toBeCalledTimes(0)
        expect(newTableWithStatesFromAPI.getEuStates).not.toBeCalled()
    });
})
