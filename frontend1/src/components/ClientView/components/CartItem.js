const CartItem = ({ item, setItemsCart }) => {

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const removeFromCart = (item) => {
        setItemsCart((currentList) => {
            const newList = currentList.filter((element) => element.item._id != item.item._id)
            alert("Item Removed")
            return newList
        })
    }    

    return ( 
        <div className="storeItem">
            <div className="storeItemImage">
                <img src={item.item.image} alt="pet food" />
            </div>
            <div className="storeItemDetails">
                <div className="storeItemName">{item.item.name}</div>
                <div className="storeItemQuantity">Quantity: {item.quantity}</div>
                <div className="storeItemPrice">U. Price: {USDollar.format(item.item.price)}</div>
                <div className="storeItemPrice">T. Price: {USDollar.format(item.item.price * item.quantity)}</div>
                <div className="storeItemRemoveFromCart"><button onClick={() => removeFromCart(item)}>Remove</button></div>
            </div>
        </div>
     );
}
 
export default CartItem;