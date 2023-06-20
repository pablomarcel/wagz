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

    const { searchInput } = JSON.parse(event.body);
    if (!searchInput) {
        return { statusCode: 400, body: 'Missing searchInput' };
    }

    const session = driver.session();
    try {
        // Searching in captions and related tags
        const result = await session.run(`
            MATCH (post:Post)
            OPTIONAL MATCH (post)-[:TAGGED_AS]->(tag:Tag)
            WITH post, tag
            WHERE toLower(post.caption) CONTAINS toLower($searchInput)
            OR tag IS NOT NULL AND toLower(tag.name) CONTAINS toLower($searchInput)
            RETURN post, COLLECT(DISTINCT tag) AS tags
        `, { searchInput });

        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            const tagsData = record.get('tags').map(tag => tag ? tag.properties : null);

            return {
                id: postData.id,
                caption: postData.caption,
                fileUrl: postData.fileUrl,
                tags: tagsData.filter(Boolean).map(tag => ({
                    id: tag.id,
                    name: tag.name
                })),
            };
        });

        return { statusCode: 200, body: JSON.stringify(posts) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    } finally {
        await session.close();
    }
};
