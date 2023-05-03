const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);

    const session = driver.session();

    try {
        const petId = uuidv4();
        const result = await session.run(
            `MATCH (po:PetOwner {email: $email})
            CREATE (p:Pet {petId: $petId, name: $name, age: $age, breed: $breed})
            CREATE (po)-[:OWNS]->(p)
            RETURN p`,
            {
                email: data.email,
                petId,
                name: data.name,
                age: data.age,
                breed: data.breed
            }
        );

        const record = result.records[0];
        const pet = record.get('p').properties;

        return {
            statusCode: 200,
            body: JSON.stringify(pet)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create Pet' })
        };
    } finally {
        session.close();
    }
};
