require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const ownerId = event.path.split('/').pop();

    if (!ownerId) {
        return { statusCode: 400, body: 'Bad Request: ownerId is required' };
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (owner:PetOwner {id: $ownerId})<-[:OWNED_BY]-(pet:Pet) 
     RETURN pet`,
            { ownerId }
        );

        const pets = result.records.map((record) => record.get('pet').properties);

        return { statusCode: 200, body: JSON.stringify(pets) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message,
                stack: error.stack,
            }),
        };
    } finally {
        await session.close();
    }
};

