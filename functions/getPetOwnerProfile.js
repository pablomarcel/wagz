const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    // Parse the request body
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;

    // Open a new session
    const session = driver.session();

    try {
        // Run a Cypher query to get the PetOwner's name, bio, and fileUrl based on the user's email
        const result = await session.run(
            `
            MATCH (po:PetOwner {email: $userEmail})
            RETURN po.name AS name, po.bio AS bio, po.fileUrl AS fileUrl, po.id AS id
            `,
            { userEmail }
        );

        // Close the session
        await session.close();

        // Get the name, bio, and fileUrl from the result
        const petOwnerProfile = result.records[0].toObject();

        // Return the result
        return {
            statusCode: 200,
            body: JSON.stringify(petOwnerProfile),
        };
    } catch (error) {
        // Close the session in case of error
        await session.close();

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet owner profile' }),
        };
    }
};
