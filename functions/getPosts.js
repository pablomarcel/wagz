const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (p:Pet)-[:CREATED]->(post:Post)
            RETURN post ORDER BY post.timestamp DESC`
        );

        const posts = result.records.map(record => record.get('post').properties);

        return {
            statusCode: 200,
            body: JSON.stringify(posts)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get posts' })
        };
    } finally {
        session.close();
    }
};
