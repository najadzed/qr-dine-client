import { useEffect, useState, useMemo } from "react";
import CartMobile from "./CartMobile";
import "./mobile.css";

const API = "https://qr-dine-backend-xbja.onrender.com/api/";

function MenuMobile() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegFilter, setVegFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  /* ================= TABLE FROM QR ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) setTableId(t);
  }, []);

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    fetch(API + "menu/")
      .then(res => res.json())
      .then(data => {
        setMenu(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= CATEGORY LIST ================= */
  const categories = useMemo(() => {
    const cats = menu.map(
      item => item.category_name || item.category || "Menu"
    );
    return ["All", ...new Set(cats)];
  }, [menu]);

  /* ================= FILTERED MENU ================= */
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const category =
        item.category_name || item.category || "Menu";

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      const matchesVeg =
        vegFilter === "All" ||
        item.food_type === vegFilter;

      const matchesPrice =
        !maxPrice || item.price <= Number(maxPrice);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVeg &&
        matchesPrice
      );
    });
  }, [menu, selectedCategory, search, vegFilter, maxPrice]);

  /* ================= CART ================= */
  function addToCart(item) {
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      setCart(
        cart.map(c =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  function increaseQty(id) {
    setCart(
      cart.map(c =>
        c.id === id ? { ...c, qty: c.qty + 1 } : c
      )
    );
  }

  function decreaseQty(id) {
    setCart(
      cart
        .map(c =>
          c.id === id ? { ...c, qty: c.qty - 1 } : c
        )
        .filter(c => c.qty > 0)
    );
  }

  function removeItem(id) {
    setCart(cart.filter(c => c.id !== id));
  }

  /* ================= PLACE ORDER ================= */
  async function placeOrder() {
    if (!cart.length) return alert("Cart is empty");

    try {
      const response = await fetch(API + "order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          table: tableId,
          items: cart.map(c => ({
            item: c.id,
            quantity: c.qty
          }))
        })
      });

      if (!response.ok) throw new Error();

      alert("✅ Order placed successfully!");
      setCart([]);

    } catch {
      alert("❌ Failed to place order");
    }
  }

  if (loading) return <h3 className="loading">Loading menu...</h3>;

  return (
    <div className="menu-container">

      {/* HEADER */}
      <div className="menu-header">
        🍽️ Digital Menu — Table {tableId}
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="filters-row">

        <select
          value={vegFilter}
          onChange={e => setVegFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />

      </div>

      {/* CATEGORY TABS */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={
              selectedCategory === cat
                ? "tab active"
                : "tab"
            }
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU ITEMS */}
      <div className="menu-list">
        {filteredMenu.length === 0 && (
          <p className="no-items">No items found</p>
        )}

        {filteredMenu.map(item => (
          <div className="menu-card" key={item.id}>
            <img
              className="menu-img"
              src={
                item.image ||
                "https://via.placeholder.com/90"
              }
              alt={item.name}
            />

            <div className="menu-info">
              <h4>{item.name}</h4>

              {item.food_type && (
                <span
                  className={
                    item.food_type === "Veg"
                      ? "veg-tag"
                      : "nonveg-tag"
                  }
                >
                  {item.food_type}
                </span>
              )}

              <p className="price">
                ₹{Number(item.price).toFixed(2)}
              </p>

              <button
                className="add-btn"
                onClick={() => addToCart(item)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CART */}
      <CartMobile
        cart={cart}
        placeOrder={placeOrder}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        removeItem={removeItem}
      />

    </div>
  );
}

export default MenuMobile;
