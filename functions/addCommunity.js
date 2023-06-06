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

    const ownerId = event.path.split('/').pop();
    const body = JSON.parse(event.body);
    const { name, about, fileUrl, tags } = body;

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                MATCH (owner:PetOwner) WHERE owner.id = $ownerId
                CREATE (community:Community {id: $id, name: $name, about: $about, fileUrl: $fileUrl})-[:CREATED_BY]->(owner)
                RETURN community
            `;
            const params = { id: uuidv4(), ownerId, name, about, fileUrl };
            const response = await tx.run(query, params);
            const community = response.records[0].get('community').properties;

            // Handle tags, if any
            if (tags) {
                for (const tagName of tags) {
                    // Check if tag already exists, otherwise create a new one
                    const tagExists = await tx.run(`
                        MATCH (t:Tag {name: $tagName})
                        RETURN t
                    `, { tagName });

                    if (!tagExists.records.length) {
                        await tx.run(`
                            CREATE (t:Tag {name: $tagName})
                        `, { tagName });
                    }

                    // Create a relationship from the community to the tag
                    await tx.run(`
                        MATCH (c:Community {id: $communityId})
                        MATCH (t:Tag {name: $tagName})
                        MERGE (c)-[:TAGGED_AS]->(t)
                    `, { communityId: community.id, tagName });
                }
            }

            return community;
        });

        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while adding the community.', details: error.message }),
        };
    } finally {
        await session.close();
    }
};
