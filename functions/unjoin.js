const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unjoinCommunity = async (userEmail, communityId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})-[relationship:JOINED]->(community:Community {id: $communityId})
                DELETE relationship
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
        const unjoinResult = await unjoinCommunity(userEmail, communityId);
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
