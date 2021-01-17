function makeEventsArray() {
    return [
        {
            user_id: 1,
            event_type: 'planting',
            event_date: '2021-04-12',
            completed: false,
            notes: 'Radishes'
        },
        {
            user_id: 3,
            event_type: 'planting',
            event_date: '2021-04-18',
            completed: false,
            notes: 'Radishes'
        },
        {
            user_id: 1,
            event_type: 'watering',
            event_date: '2021-03-05',
            completed: true,
            notes: 'Entire Garden'
        }
    ]
}

module.exports = makeEventsArray;