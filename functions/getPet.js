const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getPet = async (petId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (pet:Pet { id: $petId })
                RETURN pet
            `, { petId })
        );

        console.log('Query result:', result.records);

        if (result.records.length === 0) {
            return null;
        }

        const petData = result.records[0].get('pet').properties;

        return {
            id: petData.id,
            name: petData.name,
            age: petData.age,
            breed: petData.breed,
            fileUrl: petData.fileUrl,  // Added fileUrl
            bio: petData.bio,          // Added bio
        };
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing pet id' }),
            };
        }

        const body = JSON.parse(event.body);
        const pet = await getPet(body.petId);

        if (!pet) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Pet not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(pet),
        };
    } catch (error) {
        console.error('Error fetching pet:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet' }),
        };
    }
};
