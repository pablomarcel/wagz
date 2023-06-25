const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unfollowUser = async (hashedFollowerEmail, hashedUnfolloweeEmail) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})-[r:FOLLOWS]->(unfollowee:PetOwner {hashEmail: $hashedUnfolloweeEmail})
                DELETE r
            `,
                { hashedFollowerEmail, hashedUnfolloweeEmail }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, unfolloweeEmail } = JSON.parse(event.body);
        const hashedFollowerEmail = crypto.createHash('sha256').update(followerEmail).digest('hex');
        const hashedUnfolloweeEmail = crypto.createHash('sha256').update(unfolloweeEmail).digest('hex');
        const unfollowResult = await unfollowUser(hashedFollowerEmail, hashedUnfolloweeEmail);
        return {
            statusCode: 200,
            body: JSON.stringify(unfollowResult),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to unfollow user' }),
        };
    }
};
