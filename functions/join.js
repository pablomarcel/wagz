const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const joinCommunity = async (userEmailHash, communityId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {hashEmail: $userEmailHash})
                MATCH (community:Community {id: $communityId})
                MERGE (user)-[:JOINED]->(community)
            `,
                { userEmailHash, communityId }
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
        const userEmailHash = crypto.createHash('sha256').update(userEmail).digest('hex');
        const joinResult = await joinCommunity(userEmailHash, communityId);
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
