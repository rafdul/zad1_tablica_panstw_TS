import { TabWithStates, logsTexts } from './config'

export class TableWithStatesEU {
    states: Array<TabWithStates>;
    tableStatesWithoutIndicatedLetter: Array<TabWithStates> = [];

    constructor(states: Array<TabWithStates>) {
        this.states = states;
    }

    init() {
        this.addDensity(this.states);
    }

    // dodaj gęstość zaludnienia
    addDensity(tableStates:  Array<TabWithStates>): void {        
        tableStates.forEach(item => {
            if(item.population != undefined && item.area != undefined) {
                item.density = parseFloat((item.population / item.area).toFixed(2));
            }
        });

        this.compareStates(tableStates, 'density')
        this.removeLetterFromName(tableStates, 'a');
        this.countEUPopulation(tableStates, 5);
    }

    // sortowanie państw wg jakiegoś kryterium (keyBySort)
    compareStates(tableWithStates:Array<TabWithStates>, keyBySort:string): void {
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
    }

    // usunąć państwa posiadające literę A lub a
    removeLetterFromName(tableWithStates: Array<TabWithStates>, letter: string): void {
        tableWithStates.forEach( item => {
            if( !(item.name).toLowerCase().includes(letter) ) this.tableStatesWithoutIndicatedLetter.push(item);
        })

        console.log(logsTexts.tableWithStatesEU.removeLetterA.showTable, this.tableStatesWithoutIndicatedLetter);
    }

    // suma populacji 5 najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
    countEUPopulation(tableWithStates:Array<TabWithStates>, amountStates: number): void {
        const onlyTopStates = tableWithStates.slice(0,amountStates);
        const nameTopStates: string[] = onlyTopStates.map(el => el.name);
        const sumOfPopulation: number = onlyTopStates.reduce( (a,b) => a + b.population, 0)

        if(sumOfPopulation > 500000000) {
            return console.log(logsTexts.tableWithStatesEU.countEUPopulation.prelude + amountStates + logsTexts.tableWithStatesEU.countEUPopulation.moreThan + sumOfPopulation.toString() + logsTexts.tableWithStatesEU.countEUPopulation.infoAboutStates + nameTopStates.join(', '));
        } else {
            return console.log(logsTexts.tableWithStatesEU.countEUPopulation.prelude + amountStates + logsTexts.tableWithStatesEU.countEUPopulation.lessThan + sumOfPopulation.toString() + logsTexts.tableWithStatesEU.countEUPopulation.infoAboutStates + nameTopStates.join(', '));
        }
    }
}
