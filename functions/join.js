const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const joinCommunity = async (userEmail, communityId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})
                MATCH (community:Community {id: $communityId})
                MERGE (user)-[:JOINED]->(community)
            `,
                { userEmail, communityId }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { userEmail, communityId } = JSON.parse(event.body);
        const joinResult = await joinCommunity(userEmail, communityId);
        return {
            statusCode: 200,
            body: JSON.stringify(joinResult),
        };
    } catch (error) {
        console.error('Error joining community:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to join community' }),
        };
    }
};
