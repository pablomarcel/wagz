const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    // Parse the request body
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;

    // Create a hash of the email
    const hash = crypto.createHash('sha256');
    const hashedUserEmail = hash.update(userEmail, 'utf8').digest('hex');

    // Open a new session
    const session = driver.session();

    try {
        // Run a Cypher query to get the posts that the user has liked
        const result = await session.run(
            `
            MATCH (po:PetOwner {hashEmail: $hashedUserEmail})-[r:LIKES]->(p:Post)
            RETURN p.id AS id
            `,
            { hashedUserEmail }
        );

        // Close the session
        await session.close();

        // Convert the result into an array of post IDs
        const likedPostIds = result.records.map(record => record.get('id'));

        // Return the result
        return {
            statusCode: 200,
            body: JSON.stringify(likedPostIds),
        };
    } catch (error) {
        // Close the session in case of error
        await session.close();

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch liked posts' }),
        };
    }
};
