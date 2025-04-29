import CartItem from "./components/CartItem";

const StoreCart = ({itemsCart, checkOutTotal, setItemsCart}) => {

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return ( 
        <>
            <div className="storeCart">
                <h1>Shopping Cart</h1>
                <div className="storeCartCheckOut">
                    <div className="storeCartCheckOutTotal">Total is: {USDollar.format(checkOutTotal)}</div>
                    <button className={checkOutTotal == 0 ? "disable" : ""} disabled={checkOutTotal == 0 ? "disabled" : ""}>Check Out</button>
                </div>
                <hr />
                <div className="storeCartItemsContainer">
                    {itemsCart && (itemsCart.map((element,iteration) => (
                        <CartItem item={element} key={iteration} setItemsCart={setItemsCart} />
                    )))}    
                </div>
            </div>
        </>
     );
}
 
export default StoreCart;