import { logsTexts } from './config';
import { TabWithStates } from './types';
import { compareValue } from './utilsFunctions';

export class TableWithStatesEU {
    states: Array<TabWithStates> = [];
    tableStatesWithoutIndicatedLetter: Array<TabWithStates> = [];

    init(data: Array<TabWithStates>): void {
        this.states = data;
        this.addDensity(this.states);
    }

    // dodaj gęstość zaludnienia
    addDensity(tableStates:  Array<TabWithStates>): void {        
        tableStates.forEach(item => {
            if(item.population != undefined && item.area != undefined) {
                item.density = parseFloat((item.population / item.area).toFixed(2));
            }
        });

        compareValue(tableStates, 'density')
        console.log(logsTexts.tableWithStatesEU.addDensity.showTable, tableStates);

        this.removeLetterFromName(tableStates, 'a');
        this.countEUPopulation(tableStates, 5);
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

        const lessOrMore = (sumOfPopulation > 500000000) ? logsTexts.tableWithStatesEU.countEUPopulation.moreThan : logsTexts.tableWithStatesEU.countEUPopulation.lessThan
        
        console.log(logsTexts.tableWithStatesEU.countEUPopulation.prelude + amountStates + lessOrMore + sumOfPopulation.toString() + logsTexts.tableWithStatesEU.countEUPopulation.infoAboutStates + nameTopStates.join(', '));
    }
}

export const tableWithStatesEU = new TableWithStatesEU();