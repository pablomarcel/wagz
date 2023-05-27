// unsavePost.js
const neo4j = require('neo4j-driver');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;
    const postId = body.postId;

    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    try {
        const result = await session.run(
            `
      MATCH (u:PetOwner {email: $userEmail})-[r:SAVES]->(p:Post {id: $postId})
      DELETE r
      `,
            { userEmail, postId }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post unsaved successfully.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error unsaving post.' }),
        };
    } finally {
        await session.close();
        await driver.close();
    }
};
