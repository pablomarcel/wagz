async function getPetOwnerName(userEmail) {
    const response = await fetch('/.netlify/functions/getPetOwnerName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    return data;
}

export { getPetOwnerName };
