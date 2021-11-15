import Cookie from 'js-cookie';

interface IStorage {
    set: (key: string, value: Object) => void;
    get: (key: string) => void;
    remove: (key: string) => void;
}


const storage = {} as IStorage;

// Safari in incognito has local storage, but size 0
// This system falls back to cookies in that situation
try {
    if (!window.localStorage) {
        throw Error('no local storage');
    }

    // Setup simple local storage wrapper
    storage.set = (key: string, value: Object) => localStorage.setItem(key, JSON.stringify(value));
    storage.get = (key: string) => {
        const item = localStorage.getItem(key);

        if (item) {
            return JSON.parse(item);
        }

        return null;
    };
    storage.remove = key => localStorage.removeItem(key);
} catch (e) {
    storage.set = Cookie.set;
    storage.get = Cookie.get;
    storage.remove = Cookie.remove;
}

export default storage;