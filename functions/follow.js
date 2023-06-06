const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const followUser = async (followerEmail, followeeEmail) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {email: $followerEmail})
          MATCH (followee:PetOwner {email: $followeeEmail})
          MERGE (follower)-[:FOLLOWS]->(followee)
        `,
                { followerEmail, followeeEmail }
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
