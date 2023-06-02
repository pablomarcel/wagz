const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getEvent = async (eventId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (event:Event { id: $eventId })
                RETURN event
            `, { eventId })
        );

        console.log('Query result:', result.records);

        if (result.records.length === 0) {
            return null;
        }

        const eventData = result.records[0].get('event').properties;

        return {
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            location: eventData.location,
            imageUrl: eventData.imageUrl,
            organizer: eventData.organizer
            // Include any other properties your Event nodes might have
        };
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing event id' }),
            };
        }

        const body = JSON.parse(event.body);
        const eventItem = await getEvent(body.eventId);

        if (!eventItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Event not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(eventItem),
        };
    } catch (error) {
        console.error('Error fetching event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch event' }),
        };
    }
};
