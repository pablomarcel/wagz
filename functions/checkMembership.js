const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const checkMembership = async (userEmail, communityId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {email: $userEmail})-[relationship:JOINED]->(community:Community {id: $communityId})
                RETURN relationship IS NOT NULL AS isMember
            `,
                { userEmail, communityId }
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
        const { userEmail, communityId } = JSON.parse(event.body);
        const isMember = await checkMembership(userEmail, communityId);
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
