const neo4j = require('neo4j-driver');
const crypto = require('crypto'); // <-- Require the crypto module

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const followPet = async (followerEmail, petId) => {
    // Generate the SHA-256 hash of the email
    const hash = crypto.createHash('sha256');
    hash.update(followerEmail);
    const hashedFollowerEmail = hash.digest('hex');

    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (follower:PetOwner {hashEmail: $hashedFollowerEmail})
          MATCH (followee:Pet {id: $petId})
          MERGE (follower)-[:FOLLOWS]->(followee)
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
        const followResult = await followPet(followerEmail, petId);
        return {
            statusCode: 200,
            body: JSON.stringify(followResult),
        };
    } catch (error) {
        console.error('Error following pet:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to follow pet' }),
        };
    }
};
