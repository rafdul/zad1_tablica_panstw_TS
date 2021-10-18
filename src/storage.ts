import { logsTexts } from './config';
import { TabWithStates } from './types';

export class StorageBrowser {
    getStorage(key: string): any {
        let content: number | Array<TabWithStates> | null = null;
        let contentInLocalStorage: string|null = localStorage.getItem(key);

        if(contentInLocalStorage !== null) { 
            content = JSON.parse(contentInLocalStorage);
        } else {
            content = null;
            console.log(logsTexts.storage.getStorage.failure, key);
        }
        // console.log(key, 'content', typeof content, 'czy tablica: ', Array.isArray(content));
        return content;
    }

    saveStorage(key: string, item: any ): void {
        // console.log('item w saveStorage', typeof item, 'klucz', key, ' zawartość: ', item);
        if(item === null || item === undefined) {
            return console.log(logsTexts.storage.saveStorage.failure)
        };
        if(typeof item == 'number') {
            localStorage.setItem(key, `${item}`)
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}

export const storage = new StorageBrowser();