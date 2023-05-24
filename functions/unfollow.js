const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unfollowUser = async (followerEmail, unfolloweeEmail) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {email: $followerEmail})-[r:FOLLOWS]->(unfollowee:PetOwner {email: $unfolloweeEmail})
          DELETE r
        `,
                { followerEmail, unfolloweeEmail }
            )
        );

        console.log('Unfollow user result:', result);
        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, unfolloweeEmail } = JSON.parse(event.body);
        const unfollowResult = await unfollowUser(followerEmail, unfolloweeEmail);
        return {
            statusCode: 200,
            body: JSON.stringify(unfollowResult),
        };
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to unfollow user' }),
        };
    }
};
