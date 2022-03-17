const update = (data) => {
    console.log(data)
}

// data and firestore

data = [];

db.collection('activities').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id } // create new object with ID field from firestore

        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex((item) => item.id == doc.id) // get the item from data []
                data[index] = doc; // overwrite old element with the modified one
                break;
            case 'removed':
                data = data.filter((item) => item.id !== doc.id) // filter out the removed element as new array
                break;
            default: // default case required
                break;
        }
    })
    update(data);
})

// 
