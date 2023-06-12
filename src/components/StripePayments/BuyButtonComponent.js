import * as React from 'react';

function BuyButtonComponent({ userEmail, publicFigureId }) {
    // Generating client-reference-id
    const clientReferenceId = `${userEmail}#${publicFigureId}`;

    return (
        <stripe-buy-button
            buy-button-id="buy_btn_1NHsnXG3fcXidAci0anfxLbm"
            publishable-key="pk_test_Wgm8BdVa4LKI3f4Kay2wW1Fg00wnWcUWfy"
            client-reference-id={clientReferenceId}
        >
        </stripe-buy-button>
    );
}

export default BuyButtonComponent;
