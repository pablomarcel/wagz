// savePost.js

require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { userEmail, postId } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {email: $userEmail})
            MATCH (post:Post {id: $postId})
            MERGE (owner)-[:SAVES]->(post)
            RETURN post
        `, { userEmail, postId });

        const post = result.records[0].get('post').properties;

        return { statusCode: 200, body: JSON.stringify(post) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
