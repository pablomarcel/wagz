const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userEmail = body.userEmail;

    // Hash the email
    const userEmailHash = crypto.createHash('sha256').update(userEmail).digest('hex');

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (po:PetOwner {hashEmail: $userEmailHash})<-[r:OWNED_BY]-(p:Pet)
            RETURN p.id AS id, p.name AS name, p.age AS age, p.bio AS bio, p.breed AS breed, p.fileUrl AS fileUrl
            `,
            { userEmailHash }
        );

        await session.close();

        const pets = result.records.map(record => ({
            id: record.get('id'),
            name: record.get('name'),
            age: record.get('age'),
            bio: record.get('bio'),
            breed: record.get('breed'),
            fileUrl: record.get('fileUrl')
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(pets),
        };
    } catch (error) {
        await session.close();

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pets by owner' }),
        };
    }
};
