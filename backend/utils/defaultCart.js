// Builds an empty cart object with keys 0-300, all set to 0
function getDefaultCartServer() {
    let cart = {};
    for (let i = 0; i < 300 + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

module.exports = getDefaultCartServer;
