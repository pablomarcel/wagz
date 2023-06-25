const neo4j = require('neo4j-driver');
const crypto = require('crypto');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;
    const postId = body.postId;

    // Hash the email
    const hashedUserEmail = crypto.createHash('sha256').update(userEmail).digest('hex');

    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    try {
        const result = await session.run(
            `
      MATCH (u:PetOwner {hashEmail: $hashedUserEmail})-[r:LIKES]->(p:Post {id: $postId})
      DELETE r
      `,
            { hashedUserEmail, postId }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post unliked successfully.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error unliking post.' }),
        };
    } finally {
        await session.close();
        await driver.close();
    }
};
