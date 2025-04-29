import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import HomeNavBar from "../components/NavbBars/HomeNavBar";
import Home from "../components/ClientView/Home";
import BookAppointment from "../components/ClientView/BookAppointment";
import LoginPage from "../components/ClientView/LoginPage";
import SignInPage from "../components/ClientView/SignInPage";
import Profile from "../components/ClientView/Profile";
import StoreClientView from "../components/ClientView/StoreClientView";
import StoreCart from "../components/ClientView/StoreCart";
import StoreItemMoreDetails from "../components/ClientView/StoreItemMoreDetails";
import CreatePet from "../components/ClientView/CreatePet";
import UserPets from "../components/ClientView/ViewMyPets";


const ClientView = () => {

    const [initialStoreItem, setInitialStoreItem] = useState([]);
    const [storeItems, setStoreItems] = useState([])
    const [itemsCart, setItemsCart] = useState([])
    const [checkOutTotal, setCheckOutTotal] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/items_get");
                setStoreItems(response.data);
                setInitialStoreItem(response.data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchItems();
    }, []);
    

    useEffect(() => {
        let total = 0
        if(itemsCart != null){
            itemsCart.map((element) => {
                total = total + (element.quantity * element.item.price)
            })
            setCheckOutTotal(total)
        }
    }, [itemsCart])
    
    return ( 
        <> 
            <HomeNavBar loggedIn={isLoggedIn}  username="Reshan"/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route exact path='/Store' element={<StoreClientView storeItems={storeItems} setItemsCart={setItemsCart} itemsCart={itemsCart} setStoreItems={setStoreItems} initialStoreItem={initialStoreItem} />} />
                <Route path="/Store/:itemID" element={<StoreItemMoreDetails storeItems={initialStoreItem} setItemsCart={setItemsCart} />} />
                <Route path="/BookAppointment" element={<BookAppointment />} />
                <Route path="/createPet" element={<CreatePet />} />
                <Route path="/StoreCart" element={<StoreCart itemsCart={itemsCart} checkOutTotal={checkOutTotal} setItemsCart={setItemsCart} />} />
                <Route path='/Login' element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path='/Signin' element={<SignInPage />} />
                <Route path='/Profile' element={<Profile />} />
                <Route path='/ViewMyPets' element={<UserPets />} />
                
            </Routes>
            <div className="footer">
                <p>All Rights Reservered | Copyright 2024</p>
            </div>
        </>
     );
}
 
export default ClientView;