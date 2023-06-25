const neo4j = require('neo4j-driver');
const crypto = require('crypto'); // <-- Require the crypto module

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const followUser = async (followerEmail, followeeEmail) => {
    // Generate the SHA-256 hashes of the emails
    const hashFollower = crypto.createHash('sha256');
    hashFollower.update(followerEmail);
    const hashedFollowerEmail = hashFollower.digest('hex');

    const hashFollowee = crypto.createHash('sha256');
    hashFollowee.update(followeeEmail);
    const hashedFolloweeEmail = hashFollowee.digest('hex');

    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})
          MATCH (followee:PetOwner {hashEmail: $hashedFolloweeEmail})
          MERGE (follower)-[:FOLLOWS]->(followee)
        `,
                { hashedFollowerEmail, hashedFolloweeEmail }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, followeeEmail } = JSON.parse(event.body);
        const followResult = await followUser(followerEmail, followeeEmail);
        return {
            statusCode: 200,
            body: JSON.stringify(followResult),
        };
    } catch (error) {
        console.error('Error following user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to follow user' }),
        };
    }
};
