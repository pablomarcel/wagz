const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchEventItems = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (event:Event)
        RETURN event
      `)
        );

        console.log('Query result:', result.records);

        const events = result.records.map((record) => {
            const eventData = record.get('event').properties;
            return {
                id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                location: eventData.location,
                imageUrl: eventData.imageUrl,
                organizer: eventData.organizer
            };
        });

        return events;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const items = await fetchEventItems();
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        console.error('Error fetching event items:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch event items' }),
        };
    }
};
