// createPost.js
require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    console.log('Received parameters:', event.body);


    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { petOwnerId, petId, caption, fileUrl } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {id: $petOwnerId})
            MATCH (pet:Pet {id: $petId})
            CREATE (post:Post {id: randomUUID(), caption: $caption, fileUrl: $fileUrl})
            MERGE (owner)-[:POSTED]->(post)
            MERGE (post)-[:ABOUT]->(pet)
            RETURN post
        `, { petOwnerId, petId, caption, fileUrl });

        const post = result.records[0].get('post').properties;

        return { statusCode: 200, body: JSON.stringify(post) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
