const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getFollowStatus = async (hashedFollowerEmail, hashedFolloweeEmail) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})-[r:FOLLOWS]->(followee:PetOwner {hashEmail: $hashedFolloweeEmail})
                RETURN r IS NOT NULL AS isFollowing
            `,
                { hashedFollowerEmail, hashedFolloweeEmail }
            )
        );

        if (result.records.length === 0) {
            throw new Error('No such users found');
        }

        return result.records[0].get('isFollowing');
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, followeeEmail } = JSON.parse(event.body);

        // Hash the followerEmail
        const hash = crypto.createHash('sha256');
        const hashedFollowerEmail = hash.update(followerEmail, 'utf8').digest('hex');

        // Hashed followeeEmail already coming from the frontend
        const hashedFolloweeEmail = followeeEmail;

        const followStatus = await getFollowStatus(hashedFollowerEmail, hashedFolloweeEmail);
        return {
            statusCode: 200,
            body: JSON.stringify({ isFollowing: followStatus }),
        };
    } catch (error) {
        console.error('Error checking follow status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get follow status' }),
        };
    }
};
