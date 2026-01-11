const schedules = [
    {
        "_id": "6954b8d7cae7900a47ff212",
        "staff": { "_id": "695444a650a11bacc62157ea", "name": "Admin" },
        "day": "Lundi",
        "startTime": "08:30",
        "endTime": "10:00",
        "classGroup": { "_id": "695444b27cae7900a47ff200", "name": "DSI2" },
        "room": "A101",
        "type": "Cours"
    }
];

const selectedClassFilter = "695444b27cae7900a47ff200";
const day = "Lundi";
const slotStart = "08:30";

function getSession(day, slotStart) {
    if (!selectedClassFilter) return null;

    const session = schedules.find(s => {
        if (!s || !s.day || !s.startTime || !s.classGroup) return false;

        const sClassId = typeof s.classGroup === 'object' ? s.classGroup._id?.toString() : s.classGroup.toString();
        const filterId = selectedClassFilter.toString();

        console.log(`Comparing: Day(${s.day}===${day}), Time(${s.startTime.trim()}===${slotStart.trim()}), ID(${String(sClassId)}===${String(filterId)})`);

        return s.day === day &&
            s.startTime?.trim() === slotStart?.trim() &&
            String(sClassId) === String(filterId);
    });

    return session;
}

const result = getSession(day, slotStart);
console.log('Result:', result ? 'FOUND' : 'NOT FOUND');
