const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const unfollowPet = async (hashedFollowerEmail, petId) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})-[r:FOLLOWS]->(unfollowee:Pet {id: $petId})
                DELETE r
            `,
                { hashedFollowerEmail, petId }
            )
        );

        return result;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { followerEmail, petId } = JSON.parse(event.body);
        const hashedFollowerEmail = crypto.createHash('sha256').update(followerEmail).digest('hex');
        const unfollowResult = await unfollowPet(hashedFollowerEmail, petId);
        return {
            statusCode: 200,
            body: JSON.stringify(unfollowResult),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to unfollow pet' }),
        };
    }
};
