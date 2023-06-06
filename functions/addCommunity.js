require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const ownerId = event.path.split('/').pop();
    const body = JSON.parse(event.body);
    const { name, about, fileUrl } = body;

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                MATCH (owner:PetOwner) WHERE owner.id = $ownerId
                CREATE (community:Community {id: $id, name: $name, about: $about, fileUrl: $fileUrl})-[:CREATED_BY]->(owner)
                RETURN community
            `;
            const params = { id: uuidv4(), ownerId, name, about, fileUrl };
            const response = await tx.run(query, params);
            return response.records[0].get('community').properties;
        });

        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while adding the community.', details: error.message }),
        };
    } finally {
        await session.close();
    }
};
