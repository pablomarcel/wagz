const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const joinEvent = async (userEmail, eventId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})
                MATCH (event:Event {id: $eventId})
                MERGE (user)-[:JOINED]->(event)
            `,
                { userEmail, eventId }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { userEmail, eventId } = JSON.parse(event.body);
        const joinResult = await joinEvent(userEmail, eventId);
        return {
            statusCode: 200,
            body: JSON.stringify(joinResult),
        };
    } catch (error) {
        console.error('Error joining event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to join event' }),
        };
    }
};
