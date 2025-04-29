import { useEffect, useState } from "react";

const StoreSearch = ({ setStoreItems, initialStoreItem }) => {

    const [productPriceLow, setProductPriceLow] = useState("");
    const [productPriceHigh, setProductPriceHigh] = useState("");
    const [productName, setProductName] = useState("");

    useEffect(() => {
        if (productName == "" && productPriceLow == "" && productPriceHigh == ""){
            setStoreItems(initialStoreItem)
        } else {
            setStoreItems(initialStoreItem)
            setStoreItems((currentList) => {
                if (currentList != undefined){
                    const newList = currentList.filter(storeItem => (
                        (productPriceLow == "" || parseInt(productPriceLow) <= storeItem.price) && 
                        (productPriceHigh == "" || parseInt(productPriceHigh) >= storeItem.price) && 
                        (storeItem.name.toLowerCase().includes(productName.toLowerCase()))
                    ))
                    return newList
                }
            })
        }
    }, [productPriceLow, productPriceHigh, productName])

    const clearAll = () => {
        document.getElementById("productPriceLow").value = "";
        document.getElementById("productPriceHigh").value = "";
        document.getElementById("productName").value = "";
        setProductName("")
        setProductPriceHigh("")
        setProductPriceLow("")
    }

    return ( 
        <div className="storeSearch">
            <div className="searchInput">
                <p>Min Price</p>
                <input type="number" name="productPrice" id="productPriceLow" onChange={(event) => {setProductPriceLow(event.target.value)}} />
                <p>Max Price</p>
                <input type="number" name="productPrice" id="productPriceHigh" onChange={(event) => {setProductPriceHigh(event.target.value)}} />
            </div>
            <div className="searchInput">
                <p>Name</p>
                <input type="text" name="productName" id="productName" onChange={(event) => {setProductName(event.target.value)}} />
            </div>
            <div className="searchButton">
                <button onClick={clearAll}>Clear</button>
            </div>
        </div>
     );
}
 
export default StoreSearch;