import StoreItem from './components/StoreItem'

import { NavLink } from 'react-router-dom';
import StoreSearch from './components/StoreSearch';

const StoreClientView = ({storeItems, setItemsCart, itemsCart, setStoreItems, initialStoreItem}) => {

    const sortedList = storeItems.toSorted((a,b) => (a.price - b.price))

    return ( 
        <>
            <div className="store">
                <div className="storeSideSearch">
                    <StoreSearch setStoreItems={setStoreItems} initialStoreItem={initialStoreItem} />
                </div>
                <div className="storeContent">
                    <div className='storeTitle'>
                        <p>Store</p>
                        <NavLink to="/Client/StoreCart"><button>View Cart</button></NavLink>
                    </div>
                    <hr />
                    <div className="storeItemsContainer">
                        {sortedList && (sortedList.map((element, iteration) => (
                             <StoreItem key={iteration} item={element} setItemsCart={setItemsCart} itemsCart={itemsCart} />
                        )))}
                    </div>
                    <div style={{ color: "red" }}>
                        {sortedList.length == 0 ? "No Items Match the Search Criteria" : ""}
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default StoreClientView;