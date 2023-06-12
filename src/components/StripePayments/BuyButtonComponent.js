import * as React from 'react';

function BuyButtonComponent({ userEmail, publicFigureId }) {
    // Generating client-reference-id
    const clientReferenceId = `${userEmail}#${publicFigureId}`;
    console.log(`clientReferenceId: ${clientReferenceId}`)
    console.log(`userEmail: ${userEmail}`)
    console.log(`publicFigureId: ${publicFigureId}`)

    return (
        <stripe-buy-button
            buy-button-id="buy_btn_1NHsnXG3fcXidAci0anfxLbm"
            publishable-key="pk_test_Wgm8BdVa4LKI3f4Kay2wW1Fg00wnWcUWfy"
            client-reference-id={publicFigureId}
            customer-email={userEmail}
        >
        </stripe-buy-button>
    );
}

export default BuyButtonComponent;
