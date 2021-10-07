import { TabWithStates, logsTexts } from './config'

export class TableWithStatesEU {
    private states: Array<TabWithStates>;
    private tableStatesWithoutLetterA: Array<TabWithStates> = [];

    constructor(states: Array<TabWithStates>) {
        this.states = states;
    }

    init() {
        this.addDensityAndSort(this.states);
    }

    // dodaj gęstość zaludnienia
    addDensityAndSort(tableStates:  Array<TabWithStates>): void {        
        tableStates.forEach(item => {
            if(item.population != undefined && item.area != undefined) {
                item.density = parseFloat((item.population / item.area).toFixed(2));
            }
        });

        this.compareStates(tableStates, 'density')
        this.removeLetterA(tableStates, 'a');
        this.countPopulationForAFewStatesEu(tableStates, 5);
    }

    // sortowanie państw wg jakiegoś kryterium (keyBySort)
    compareStates(tableWithStates:Array<TabWithStates>, keyBySort:string): Array<TabWithStates> {
        function compare(a:any, b:any): number  {
            if(typeof a[keyBySort] === 'number' && typeof b[keyBySort] === 'number') {
                if (a[keyBySort] > b[keyBySort]) {
                    return -1;
                }
            }
            return 0;
        }

        tableWithStates.sort(compare)
        console.log(logsTexts.tableWithStatesEU.compareStates.showTable, tableWithStates)
        return tableWithStates;
    }

    // usunąć państwa posiadające literę A lub a
    removeLetterA(tableWithStates: Array<TabWithStates>, letter: string): Array<TabWithStates> {
        tableWithStates.forEach( item => {
            if( !(item.name).toLowerCase().includes(letter) ) this.tableStatesWithoutLetterA.push(item);
        })

        console.log(logsTexts.tableWithStatesEU.removeLetterA.showTable, this.tableStatesWithoutLetterA);
        return this.tableStatesWithoutLetterA;
    }

    // suma populacji 5 najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
    countPopulationForAFewStatesEu(tableWithStates:Array<TabWithStates>, amountStates: number): number {
        const onlyTopStates = tableWithStates.slice(0,amountStates);
        const nameTopStates: string[] = onlyTopStates.map(el => el.name);
        const sumOfPopulation: number = onlyTopStates.reduce( (a,b) => a + b.population, 0)

        console.log(amountStates + logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.info + nameTopStates.join(', '))

        if(sumOfPopulation > 500000000) {
            console.log(logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.moreThan, sumOfPopulation.toString());
        } else {
            console.log(logsTexts.tableWithStatesEU.countPopulationForAFewStatesEu.lessThan, sumOfPopulation.toString()); 
        }

        return sumOfPopulation;
    }
}
