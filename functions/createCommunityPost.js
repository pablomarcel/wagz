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

    const { ownerId, communityId, caption, fileUrl, tags } = JSON.parse(event.body);

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

        // Handle tags, if any
        if (tags) {
            for (const tagName of tags) {
                // Check if tag already exists, otherwise create a new one
                const tagExists = await session.run(`
                    MATCH (t:Tag {name: $tagName})
                    RETURN t
                `, { tagName });

                if (!tagExists.records.length) {
                    await session.run(`
                        CREATE (t:Tag {name: $tagName})
                    `, { tagName });
                }

                // Create a relationship from the post to the tag
                await session.run(`
                    MATCH (p:CommunityPost {id: $postId})
                    MATCH (t:Tag {name: $tagName})
                    MERGE (p)-[:TAGGED_AS]->(t)
                `, { postId: communityPost.id, tagName });
            }
        }

        return { statusCode: 200, body: JSON.stringify(communityPost) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error:'Internal server error' }) };
    } finally {
        await session.close();
    }
};
