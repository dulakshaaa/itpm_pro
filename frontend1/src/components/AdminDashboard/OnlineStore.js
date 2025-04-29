import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const OnlineStore = () => {
    const [storeStocks, setStoreStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/items_get");
                setStoreStocks(response.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch store items. Please try again.',
                });
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);
    
    const navigate = useNavigate();

    const onDeleteButtonClick = async (itemID) => {
        // Show confirmation dialog before deleting
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this inventory item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:3001/api/items_delete/${itemID}`);
                    
                    // Remove the item from the local state
                    setStoreStocks(storeStocks.filter(stock => stock._id !== itemID));

                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Inventory item has been deleted.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: 'Unable to delete inventory item. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error deleting item:", error);
                }
            }
        });
    }

    const onUpdateButtonClick = (itemID) => {
        navigate(`/AdminDashboard/updateinventory/${itemID}`);
    }

    const filteredStoreItems = storeStocks.filter(stock => {
        return(
            stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (stock.price + "").includes(searchTerm.toLowerCase())
        )
    });

    const handleGenerateReport = () => {
        // Add confirmation and success notification for report generation
        Swal.fire({
            title: 'Generating Report',
            text: 'Please wait while the report is being prepared...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                
                html2canvas(document.getElementById('toPrint'), {backgroundColor: '#fff'}).then(canvas => {
                    let image = canvas.toDataURL('image/png')
                    let doc = new jsPDF('p', 'px', [1920, 1500])
                    doc.addImage(image, 'PNG', 50, 50, 1400, 400)
                    doc.save('inventory_report.pdf')
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Report Generated',
                        text: 'Your inventory report has been downloaded.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Report Generation Failed',
                        text: 'Unable to generate report. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error generating report:", error);
                });
            }
        });
    }

    return ( 
        <>
            <div className="buttonCollection">
                <input 
                    type="text" 
                    name="itemSearch" 
                    id="itemSearch" 
                    placeholder="Search" 
                    onChange={e => setSearchTerm(e.target.value)} 
                    value={searchTerm} 
                    className="search-input"
                />
                <button 
                    onClick={() => {
                        let path = `/AdminDashboard/addInventory`; 
                        navigate(path);
                    }} 
                    className="add-item-button"
                >
                    Add Item
                </button>
                <button 
                    onClick={handleGenerateReport} 
                    className="report-button"
                >
                    Print Report
                </button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Item Price</th>
                        <th data-html2canvas-ignore="true">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStoreItems.map((item)=> (
                        <tr key={item._id}>
                            <td className="text-center">{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td data-html2canvas-ignore="true">
                                <button 
                                    onClick={() => {onUpdateButtonClick(item._id)}}
                                    className="update-button"
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={() => {onDeleteButtonClick(item._id)}}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
     );
}
 
export default OnlineStore;