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
    const { name, breed, age, fileUrl, bio, tags } = body;

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                MATCH (owner:PetOwner) WHERE owner.id = $ownerId
                CREATE (pet:Pet {id: $id, name: $name, breed: $breed, age: $age, fileUrl: $fileUrl, bio: $bio})-[:OWNED_BY]->(owner)
                RETURN pet
            `;
            const params = { id: uuidv4(), ownerId, name, breed, age, fileUrl, bio };
            const response = await tx.run(query, params);
            const pet = response.records[0].get('pet').properties;

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

                    // Create a relationship from the pet to the tag
                    await tx.run(`
                        MATCH (p:Pet {id: $petId})
                        MATCH (t:Tag {name: $tagName})
                        MERGE (p)-[:TAGGED_AS]->(t)
                    `, { petId: pet.id, tagName });
                }
            }

            return pet;
        });

        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while adding the pet.', details: error.message }),
        };
    } finally {
        await session.close();
    }
};
