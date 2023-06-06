const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchShopItems = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (item:ShopItem)
        RETURN item
      `)
        );

        const items = result.records.map((record) => {
            const itemData = record.get('item').properties;
            return {
                id: itemData.id,
                name: itemData.name,
                description: itemData.description,
                imageUrl: itemData.imageUrl,
                price: itemData.price,
                affiliateUrl: itemData.affiliateUrl
            };
        });

        return items;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const items = await fetchShopItems();
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch shop items' }),
        };
    }
};
