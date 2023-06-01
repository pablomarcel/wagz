const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getItem = async (itemId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (item:ShopItem { id: $itemId })
                RETURN item
            `, { itemId })
        );

        console.log('Query result:', result.records);

        if (result.records.length === 0) {
            return null;
        }

        const itemData = result.records[0].get('item').properties;

        return {
            id: itemData.id,
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            imageUrl: itemData.imageUrl,  // Added fileUrl
            affiliateUrl: itemData.affiliateUrl
            // Include any other properties your ShopItem nodes might have
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
                body: JSON.stringify({ error: 'Missing item id' }),
            };
        }

        const body = JSON.parse(event.body);
        const item = await getItem(body.itemId);

        if (!item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Item not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(item),
        };
    } catch (error) {
        console.error('Error fetching item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch item' }),
        };
    }
};
