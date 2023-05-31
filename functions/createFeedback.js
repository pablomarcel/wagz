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

    const body = JSON.parse(event.body);
    const { comment, email, rating } = body;

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                MATCH (owner:PetOwner {email: $email})
                CREATE (feedback:Feedback {id: $id, comment: $comment, timestamp: datetime(), rating: $rating})
                CREATE (feedback)-[:PROVIDED_BY]->(owner)
                RETURN feedback
            `;
            const params = { id: uuidv4(), comment, email, rating };
            const response = await tx.run(query, params);
            return response.records[0].get('feedback').properties;
        });

        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred while creating the feedback.' }) };
    } finally {
        await session.close();
    }
};
