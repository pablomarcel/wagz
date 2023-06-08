// createPublicFigurePost.js
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

    const { publicFigureId, title, content, fileUrl } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (publicFigure:PublicFigure {id: $publicFigureId})
            CREATE (publicFigurePost:PublicFigurePost {id: randomUUID(), title: $title, content: $content, fileUrl: $fileUrl})
            MERGE (publicFigure)-[:POSTED]->(publicFigurePost)
            RETURN publicFigurePost
        `, { publicFigureId, title, content, fileUrl });

        const publicFigurePost = result.records[0].get('publicFigurePost').properties;

        return { statusCode: 200, body: JSON.stringify(publicFigurePost) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
