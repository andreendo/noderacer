function apply(entries, asyncObjects, relations) {
    let obj = asyncObjects.getAll().filter((o) => o.entry.type === 'Timeout');
    for (let i = 0; i < obj.length - 1; i++) {
        for (let j = i + 1; j < obj.length; j++) {
            if(obj[i].entry.id === obj[j].entry.id) {
                relations.add(obj[i].id, obj[j].id, 'interval');
                break;
            }
        }
    }
}

module.exports = { apply }