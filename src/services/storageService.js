import Dexie from 'dexie';

const db = new Dexie('IdaraDB');

db.version(1).stores({
    lectures: '++id, title, date, duration, isProcessed, tags'
});

export const saveLecture = async (data) => {
    return await db.lectures.add({
        ...data,
        date: Date.now(),
        isProcessed: false
    });
};

export const getLectures = async () => {
    return await db.lectures
        .orderBy('date')
        .reverse()
        .limit(10)
        .toArray();
};

export const getLectureById = async (id) => {
    return await db.lectures.get(id);
}

export const updateLecture = async (id, updates) => {
    return await db.lectures.update(id, updates);
};

export const deleteLecture = async (id) => {
    return await db.lectures.delete(id);
};

export { db };
