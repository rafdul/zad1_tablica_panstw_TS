import { makeRegionalBlocs, getInfoRegBloc, getInfoLanguages } from './tableRegionalBloc';
import { mockValues } from './mocks';

describe('Check, if new object with regional blocs is created and:' , () => {

    test(`check, if countries' nativeName are matched with regional blocs`, () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        // console.log('==test1==', testRegBloc)

        expect(testRegBloc.NAFTA.countries.length).toEqual(2);
        expect(testRegBloc.other.countries.length).toEqual(2);
    });

    test(`check, if countries' nativeName are sorted from z to a`, () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        // console.log('==test1==', testRegBloc)

        expect(testRegBloc.other.countries.indexOf('perussssss')).toBeLessThan(testRegBloc.other.countries.indexOf('chinasssss'));
        expect(testRegBloc.EU.countries.indexOf('netherlandsssss')).toBeLessThan(testRegBloc.EU.countries.indexOf('czechsssss'));
    });

    test(`check, if countries' currencies are matched with regional blocs`, () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        // console.log('==test2==', testRegBloc)

        expect(testRegBloc.EU.currencies.some(el => el === 'CZK')).toBe(true);
        expect(testRegBloc.AU.currencies.some(el => el === 'IRR')).toBe(true);
    });

    test(`check, if countries' currencies are uniqe in the table with currencies`, () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        // console.log('==test2==', testRegBloc)

        expect(testRegBloc.EU.currencies.length).toEqual(testRegBloc.EU.countries.length - 1);
        expect(testRegBloc.other.currencies.length).toEqual(testRegBloc.other.countries.length - 1);
    });

    test(`check, if countries' populations are summed`, () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        // console.log('==test3==', testRegBloc);
        let populationForNafta = 132322035;
        let populationForOther = 1153261217;

        expect(testRegBloc.NAFTA.population).toEqual(populationForNafta);
        expect(testRegBloc.other.population).toEqual(populationForOther);
    });
});

describe(`Check, if object with countries' languages is created and:` , () => {
    let testArray = [];
    let resultObj: PropertyDescriptor | undefined  = {};
    let testSumPopulation = 132322035;
    let testSumArea = 205715;

    beforeAll( () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        for(const key in testRegBloc.NAFTA.languages) {
            testArray.push(key)
        }
        
        resultObj = Object.getOwnPropertyDescriptor(testRegBloc.NAFTA.languages, "fr");
        // console.log('==test4==', resultObj && resultObj.value);
    })

    test('if all languages are added', () => {
        expect(testArray.length).toEqual(3);
    });

    test('if in the table with countries are all names', () => {
        expect(resultObj && resultObj.value.countries).toEqual(['CAN', 'MEX']);
    });

    test('if native name of language is correct', () => {
        expect(resultObj && resultObj.value.name).toEqual('français');
    });

    test('if population is aggregate of population each country', () => {
        expect(resultObj && resultObj.value.population).toEqual(testSumPopulation);
    });

    test('if area is aggregate of area each country', () => {
        expect(resultObj && resultObj.value.area).toEqual(testSumArea);
    });
});

describe('Test getInfoBloc', () => {
    test('if information in console.log is correct', () => {
        let testRegBloc = makeRegionalBlocs(mockValues.statesForNewObj);
        let expectedText = `Blok:
        - pierwszy pod wzgl. populacji: other,
        - drugi pod wzgl. gęstości: AU,
        - trzeci pod wzgl. obszaru: NAFTA,
        - ostatni pod wzgl. liczby krajów: AU,
        - pierwszy pod wzgl. liczby walut: EU,
        - pierwszy pod wzgl. liczby języków: EU,
        - ostatni pod względem liczby języków: other
        `

        console.log = jest.fn();
        getInfoRegBloc(testRegBloc);

        expect(console.log).toHaveBeenCalledWith(expectedText);
    });
})

describe('Test getInfoLanguages', () => {
    test('if information in console.log is correct', () => {
        let expectedText = `Natywne nazwy języków:
            - używane w największej liczbie państw: Espaniol,
            - używanych przez najmniejszą liczbę ludzi: cestina,
            - wykorzystywanych na największym obszarze: Espaniol,
            - wykorzystywanych na najmniejszym obszarze: Nederlands`;

        console.log = jest.fn();
        getInfoLanguages(mockValues.statesForNewObj);

        expect(console.log).toHaveBeenCalledWith(expectedText);
    });
})