const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unjoinCommunity = async (hashedUserEmail, communityId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {hashEmail: $hashedUserEmail})-[relationship:JOINED]->(community:Community {id: $communityId})
                DELETE relationship
            `,
                { hashedUserEmail, communityId }
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
        const hashedUserEmail = crypto.createHash('sha256').update(userEmail).digest('hex');
        const unjoinResult = await unjoinCommunity(hashedUserEmail, communityId);
        return {
            statusCode: 200,
            body: JSON.stringify(unjoinResult),
        };
    } catch (error) {
        console.error('Error unjoining community:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to unjoin community' }),
        };
    }
};
