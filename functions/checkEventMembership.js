const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const checkMembership = async (userEmail, eventId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})-[relationship:JOINED]->(event:Event {id: $eventId})
                RETURN relationship IS NOT NULL AS isMember
            `,
                { userEmail, eventId }
            )
        );

        const singleRecord = result.records[0];
        const isMember = singleRecord.get('isMember');

        return isMember;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { userEmail, eventId } = JSON.parse(event.body);
        const isMember = await checkMembership(userEmail, eventId);
        return {
            statusCode: 200,
            body: JSON.stringify({ isMember }),
        };
    } catch (error) {
        console.error('Error checking membership:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to check membership' }),
        };
    }
};
