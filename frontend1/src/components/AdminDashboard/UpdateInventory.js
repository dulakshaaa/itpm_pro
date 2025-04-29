import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const UpdateInventory = () => {
    const [inventoryData, setInventoryData] = useState({
        name: '',
        description: '',
        price: ''
    });

    const {itemID} = useParams();

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(`http://localhost:3001/api/item_get/${itemID}`);
                setInventoryData({
                    name: response.data.name,
                    description: response.data.description,
                    price: response.data.price
                });
            } catch (error) {
                console.error("Error finding item: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch item details. Please try again.',
                });
            }
        };
        fetchData();
    }, [itemID]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setInventoryData({...inventoryData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate input fields
        if (!inventoryData.name || !inventoryData.description || !inventoryData.price) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Information',
                text: 'Please fill in all fields before submitting.',
            });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3001/api/items_update/${itemID}`, inventoryData);
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Inventory item updated successfully.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Redirect after success
                window.location.href = '/AdminDashboard/OnlineStore';
            });

        } catch (error) {
            console.error('Error updating inventory:', error);
            
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Unable to update inventory item. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    return ( 
        <div className="createForm">
            <h1>Update Inventory Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="createFormInput">
                    <label htmlFor="name">Item Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={inventoryData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="createFormInput">
                    <label htmlFor="description">Item Description:</label>
                    <textarea 
                        name="description" 
                        id="description" 
                        cols="30" 
                        rows="10" 
                        onChange={handleChange}  
                        value={inventoryData.description}
                        required
                    ></textarea>
                </div>
                <div className="createFormInput">
                    <label htmlFor="price">Item Price:</label>
                    <input 
                        type="number" 
                        name="price" 
                        id="price" 
                        onChange={handleChange} 
                        value={inventoryData.price} 
                        min="0" 
                        step="0.01" 
                        required 
                    />
                </div>
                <div className="createFormSubmit">
                    <button type="submit">Update Inventory Item</button>
                </div>
            </form>
        </div>
     );
}
 
export default UpdateInventory;