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

    const { ownerId, communityId, caption, fileUrl } = JSON.parse(event.body);

    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (owner:PetOwner {id: $ownerId})
            MATCH (community:Community {id: $communityId})
            CREATE (post:CommunityPost {id: randomUUID(), caption: $caption, fileUrl: $fileUrl})
            MERGE (owner)-[:POSTED]->(post)
            MERGE (post)-[:ABOUT]->(community)
            RETURN post
        `, { ownerId, communityId, caption, fileUrl });

        const communityPost = result.records[0].get('post').properties;

        return { statusCode: 200, body: JSON.stringify(communityPost) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
