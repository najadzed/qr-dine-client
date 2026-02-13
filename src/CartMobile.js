import "./mobile.css";

function CartMobile({
  cart,
  placeOrder,
  increaseQty,
  decreaseQty,
  removeItem
}) {

  // 🔒 Safe price converter
  const getPrice = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // ✅ Safe total calculation
  const total = cart.reduce(
    (sum, item) => sum + getPrice(item.price) * item.qty,
    0
  );

  if (!cart.length) return null;

  return (
    <div className="cart-bar">

      <div className="cart-header">
        <h3>Your Cart</h3>
      </div>

      <div className="cart-items">
        {cart.map(item => {

          const price = getPrice(item.price);
          const lineTotal = price * item.qty;

          return (
            <div className="cart-row" key={item.id}>

              <div className="cart-left">
                <div className="cart-name">{item.name}</div>
                <div className="cart-sub">
                  ₹{price.toFixed(2)} × {item.qty}
                </div>
              </div>

              <div className="cart-right">

                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.id)}
                  >
                    −
                  </button>

                  <span className="qty-value">
                    {item.qty}
                  </span>

                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-price">
                  ₹{lineTotal.toFixed(2)}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>

              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>{cart.length} items</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>

        <button
          className="order-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>

    </div>
  );
}

export default CartMobile;
