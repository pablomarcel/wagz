const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const followUser = async (hashedFollowerEmail, hashedFolloweeEmail) => {
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
    //console.log('event.body: ', event.body); // Add this line to troubleshoot
    try {
        const { followerEmail, followeeEmail } = JSON.parse(event.body);
        if (!followerEmail || !followeeEmail) {
            throw new Error('Missing required parameters');
        }

        // Hash followerEmail
        const hashFollower = crypto.createHash('sha256');
        hashFollower.update(followerEmail);
        const hashedFollowerEmail = hashFollower.digest('hex');

        const followResult = await followUser(hashedFollowerEmail, followeeEmail);
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
