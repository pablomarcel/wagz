const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    // Parse the request body
    const body = JSON.parse(event.body);
    const postId = body.postId;

    // Open a new session
    const session = driver.session();

    try {
        // Run a Cypher query to count the number of likes for the post
        const result = await session.run(
            `
            MATCH (p:Post {id: $postId})<-[r:LIKES]-(po:PetOwner)
            RETURN COUNT(r) AS likesCount
            `,
            { postId }
        );

        // Close the session
        await session.close();

        // Extract the count from the result
        const likesCount = result.records[0].get('likesCount').toNumber();

        // Return the result
        return {
            statusCode: 200,
            body: JSON.stringify({ likesCount }),
        };
    } catch (error) {
        // Close the session in case of error
        await session.close();

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to count likes' }),
        };
    }
};
