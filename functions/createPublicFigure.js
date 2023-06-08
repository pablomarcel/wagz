require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const body = JSON.parse(event.body);

    const { name, bio, occupation, imageUrl, birthDate, birthPlace, nationality, knownFor } = body;

    const id = uuidv4(); // Generate a new UUID for the public figure

    const session = driver.session();

    try {
        const result = await session.run(
            `
            CREATE (p:PublicFigure {
                id: $id, 
                name: $name, 
                bio: $bio, 
                occupation: $occupation, 
                imageUrl: $imageUrl,
                birthDate: $birthDate,
                birthPlace: $birthPlace,
                nationality: $nationality,
                knownFor: $knownFor
            })
            RETURN p.id AS id, p.name AS name
            `,
            { id, name, bio, occupation, imageUrl, birthDate, birthPlace, nationality, knownFor }
        );

        const createdPublicFigure = result.records.map(record => ({
            id: record.get('id'),
            name: record.get('name'),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(createdPublicFigure),
        };
    } catch (error) {
        console.error('Neo4j operation error:', error); // Log the error for debugging.

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }), // Return the actual error message for debugging.
        };
    } finally {
        await session.close();
    }
};
