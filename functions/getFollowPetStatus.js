const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getFollowPetStatus = async (followerEmail, petId) => {
    const session = driver.session();

    // Hash the email using SHA-256
    const hash = crypto.createHash('sha256');
    const hashedFollowerEmail = hash.update(followerEmail, 'utf8').digest('hex');

    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})-[r:FOLLOWS]->(followee:Pet {id: $petId})
                RETURN r IS NOT NULL AS isFollowing
            `,
                { hashedFollowerEmail, petId }
            )
        );

        if (result.records.length === 0) {
            throw new Error('No such pets found');
        }

        return result.records[0].get('isFollowing');
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, petId } = JSON.parse(event.body);
        const followStatus = await getFollowPetStatus(followerEmail, petId);
        return {
            statusCode: 200,
            body: JSON.stringify({ isFollowing: followStatus }),
        };
    } catch (error) {
        console.error('Error checking follow pet status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get follow pet status' }),
        };
    }
};
