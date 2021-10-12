import { startRegionalbloc } from './tableRegionalBloc';
import { mockValues } from './mocks';

describe('Check, if new object with regional blocs is created and:' , () => {

    test(`check, if countries' nativeName are matched with regional blocs`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        // console.log('==test1==', testRegBloc)

        expect(testRegBloc.NAFTA.countries.length).toEqual(2);
        expect(testRegBloc.other.countries.length).toEqual(2);
    });

    test(`check, if countries' currencies are matched with regional blocs`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        // console.log('==test2==', testRegBloc)

        expect(testRegBloc.EU.currencies.length).toEqual(2);
        expect(testRegBloc.EU.currencies.some(el => el === 'CZK')).toBe(true);
        expect(testRegBloc.other.currencies.length).toEqual(1);
        expect(testRegBloc.other.currencies.some(el => el === 'CNY')).toBe(true);
    });

    test(`check, if countries' populations are summed`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        // console.log('==test3==', testRegBloc);
        let populationForNafta = 132322035;
        let populationForOther = 1153261217;

        expect(testRegBloc.NAFTA.population).toEqual(populationForNafta);
        expect(testRegBloc.other.population).toEqual(populationForOther);
    });

    test(`check, if countries' languages are added to object languages`, () => {
        let testRegBloc = startRegionalbloc(mockValues.statesForNewObj);
        // console.log('==test3==', testRegBloc);
        let testArray = [];
        for(const key in testRegBloc.NAFTA.languages) {
            testArray.push(key)
        }
        
        let resultObj: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(testRegBloc.NAFTA.languages, "fr");
        // console.log('==test4==', resultObj && resultObj.value);
        
        expect(testArray.length).toEqual(3);
        expect(resultObj && resultObj.value.countries).toEqual(['CAN', 'MEX']);
        expect(resultObj && resultObj.value.population).toEqual(132322035);
        expect(resultObj && resultObj.value.name).toEqual('kanadassssss, meksyksssss');
    })
});