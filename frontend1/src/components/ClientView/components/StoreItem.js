import { NavLink } from "react-router-dom";
import { PiArrowSquareUpRightFill } from "react-icons/pi";

const StoreItem = ({ item, setItemsCart }) => {

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const addToCart = () => {
        let quantity = prompt("Enter Quantity")
        if (quantity == "" || quantity == null || quantity == undefined || quantity == " "){
            quantity = 1
        }
        setItemsCart((currentList) => {
            if (Object.keys(currentList).length == 0){
                return [ {item , quantity }]
            } else {
                if(currentList.some(element => (element.item._id == item._id && quantity == element.item.quantity))){
                    return [ ...currentList ]
                } else if (currentList.some(element => (element.item._id == item._id && quantity != element.item.quantity))){
                    const index = currentList.findIndex(element => (element.item._id == item._id && quantity != element.item.quantity))
                    currentList[index].quantity = quantity
                    return [ ...currentList ]
                }
                return [...currentList, {item, quantity }]
            }
        })
        alert("Item Added to Cart")
    }

    return ( 
        <div className="storeItem">
            <div className="storeItemImage">
                <img src={item.image} alt="pet food" />
            </div>
            <div className="storeItemDetails">
                <div className="storeItemName"><NavLink to={`/Client/Store/${item._id}`}>{item.name} <PiArrowSquareUpRightFill /></NavLink></div>
                <div className="storeItemPrice">U. Price: {USDollar.format(item.price)}</div>
                <div className="storeItemAddToCart">
                    <button onClick={() => {addToCart()}}>Add to Cart</button>
                </div>
            </div>
        </div>
     );
}
 
export default StoreItem;