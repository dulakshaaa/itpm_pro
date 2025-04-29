const PetProfile = ({ name, dob, gender, type, breed}) => {
    return ( 
        <div className="profilePageMainContentPet">
            <div className="profilePageMainContentPetName">{name}</div>
            <div className="profilePageMainContentPetDetails">
                <div className="profilePageMainContentPetDetailsDOB">
                    <p>DOB  </p>
                    <div>{dob}</div>
                </div>
                <div className="profilePageMainContentPetDetailsGender">
                    <p>Gender  </p>
                    <div>{gender}</div>
                </div>
                <div className="profilePageMainContentPetDetailsType">
                    <p>Type  </p>
                    <div>{type}</div>
                </div>
                <div className="profilePageMainContentPetDetailsBreed">
                    <p>Breed  </p>
                    <div>{breed}</div>
                </div>
                <div className="profilePageSideBarButtons">
                    <button className="profilePageSideBarUpdateButton">Update</button>
                    <button className="profilePageSideBarDeleteButton">Delete</button>
                </div>
            </div>
        </div>
     );
}
 
export default PetProfile;