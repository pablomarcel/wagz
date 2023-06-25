const neo4j = require('neo4j-driver');
const crypto = require('crypto'); // <-- Require the crypto module

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const checkMembership = async (hashedEmail, communityId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {hashEmail: $hashedEmail})-[relationship:JOINED]->(community:Community {id: $communityId})
                RETURN relationship IS NOT NULL AS isMember
            `,
                { hashedEmail, communityId }
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

        // Generate the SHA-256 hash of the email
        const hash = crypto.createHash('sha256');
        hash.update(userEmail);
        const hashedEmail = hash.digest('hex');

        const isMember = await checkMembership(hashedEmail, communityId);
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
