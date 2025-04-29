import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

const StoreItemMoreDetails = ({ storeItems, setItemsCart }) => {

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const {itemID} = useParams();

    const itemArray = storeItems.filter((item) => item._id == itemID)

    const item = itemArray[0]

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
        <>
        { itemArray && itemArray.length == 1 ? (
            <div className="itemMoreDetails">
                <div className="itemButtons">
                    <NavLink to="/Client/Store"><IoMdArrowRoundBack /></NavLink>
                    <button onClick={addToCart}>Add to Cart</button>
                </div>
                <div className="itemTitle">{itemArray[0].name}</div>
                <div className="itemPrice">{USDollar.format(itemArray[0].price)}</div>
                <hr />
                <div className="itemImage"><img src={"../" + itemArray[0].image} alt="itemImage" /></div>
                <div className="itemDescription">{itemArray[0].description}</div>
            </div>
        ) : (
            <>No</>
        )}
        </>
    );
}
 
export default StoreItemMoreDetails;