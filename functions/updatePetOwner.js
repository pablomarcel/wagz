const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (po:PetOwner {email: $email})
            SET po.customUserName = $customUserName, po.userName = $userName
            RETURN po`,
            {
                email: data.email,
                customUserName: data.customUserName || "",
                userName: data.customUserName || data.defaultUserName
            }
        );

        if (result.records.length === 0) {
            return { statusCode: 404, body: 'PetOwner not found' };
        }

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
            body: JSON.stringify({ error: 'Failed to update PetOwner' })
        };
    } finally {
        session.close();
    }
};
