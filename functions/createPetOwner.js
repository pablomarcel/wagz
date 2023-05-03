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
        const petOwnerId = uuidv4();
        const result = await session.run(
            `CREATE (po:PetOwner {petOwnerId: $petOwnerId, email: $email, defaultUserName: $defaultUserName, customUserName: $customUserName, userName: $userName}) RETURN po`,
            {
                petOwnerId,
                email: data.email,
                defaultUserName: data.defaultUserName,
                customUserName: data.customUserName || "",
                userName: data.customUserName || data.defaultUserName
            }
        );

        const record = result.records[0];
        const petOwner = record.get('po').properties;

        return {
            statusCode: 200,
            body: JSON.stringify(petOwner)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create PetOwner' })
        };
    } finally {
        session.close();
    }
};
