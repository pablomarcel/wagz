require('dotenv').config();
const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { userEmail, postId } = JSON.parse(event.body);
    const userEmailHash = crypto.createHash('sha256').update(userEmail).digest('hex');

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {hashEmail: $userEmailHash})
            MATCH (post:Post {id: $postId})
            MERGE (owner)-[:LIKES]->(post)
            RETURN post
        `, { userEmailHash, postId });

        const post = result.records[0].get('post').properties;

        return { statusCode: 200, body: JSON.stringify(post) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
