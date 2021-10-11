import { startRegionalbloc } from './tableRegionalBloc';
import { mockValues } from './mocks';
import { TabWithStates } from './config'

describe('Check, if new object with regional blocs is created and:' , () => {

    test(`check, if countries' nativeName are matched with regional blocs`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        // console.log('==test1==', testRegBloc)

        expect(testRegBloc.NAFTA.countries.length).toEqual(2);
        expect(testRegBloc.other.countries.length).toEqual(2);
    });

    test(`check, if countries' currencies are matched with regional blocs`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        console.log('==test2==', testRegBloc)

        expect(testRegBloc.EU.currencies.length).toEqual(2);
        expect(testRegBloc.EU.currencies.some(el => el === 'CZK')).toBe(true);
        expect(testRegBloc.other.currencies.length).toEqual(1);
        expect(testRegBloc.other.currencies.some(el => el === 'CNY')).toBe(true);
    })
});