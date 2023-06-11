import * as React from 'react';

function BuyButtonComponent() {
    // Paste the stripe-buy-button snippet in your React component
    return (
        <stripe-buy-button
            buy-button-id="buy_btn_1NHsnXG3fcXidAci0anfxLbm"
            publishable-key="pk_test_Wgm8BdVa4LKI3f4Kay2wW1Fg00wnWcUWfy"
            client-reference-id="7e6beee0-dea5-421c-9c8b-c24169085470"
        >
        </stripe-buy-button>
    );
}

export default BuyButtonComponent;
