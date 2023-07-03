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
            MATCH (post:Post)-[:ABOUT]->(pet:Pet)-[:OWNED_BY]->(owner:PetOwner)
            OPTIONAL MATCH (post)-[:TAGGED_AS]->(tag:Tag)
            WITH post, pet, owner, tag
            WHERE toLower(post.caption) CONTAINS toLower($searchInput)
            OR tag IS NOT NULL AND toLower(tag.name) CONTAINS toLower($searchInput)
            RETURN post, pet, owner, COLLECT(DISTINCT tag) AS tags
        `, { searchInput });

        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            const petData = record.get('pet') ? record.get('pet').properties : null;
            const ownerData = record.get('owner') ? record.get('owner').properties : null;
            const tagsData = record.get('tags').map(tag => tag ? tag.properties : null);

            return {
                id: postData.id,
                caption: postData.caption,
                fileUrl: postData.fileUrl,
                pet: petData ? { id: petData.id, name: petData.name } : null,
                owner: ownerData ? { id: ownerData.id, name: ownerData.name, hashEmail: ownerData.hashEmail } : null,
                tags: tagsData.filter(Boolean).map(tag => ({
                    id: tag.id,
                    name: tag.name
                })),
            };
        });

        //console.log(posts);

        return { statusCode: 200, body: JSON.stringify(posts) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    } finally {
        await session.close();
    }
};
