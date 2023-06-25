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

    // Hash the email
    const userEmailHash = crypto.createHash('sha256').update(userEmail).digest('hex');

    // Open a new session
    const session = driver.session();

    try {
        // Run a Cypher query to get the PetOwner name based on the hashed user's email
        const result = await session.run(
            `
            MATCH (po:PetOwner {hashEmail: $userEmailHash})
            RETURN po.name AS name
            `,
            { userEmailHash }
        );

        // Close the session
        await session.close();

        // If there's no result, return null or suitable default
        if (!result.records || result.records.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(null),
            };
        }

        // Get the name from the result
        const petOwnerName = result.records[0].get('name');

        // Return the result
        return {
            statusCode: 200,
            body: JSON.stringify(petOwnerName),
        };
    } catch (error) {
        // Close the session in case of error
        await session.close();

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet owner name' }),
        };
    }
};
