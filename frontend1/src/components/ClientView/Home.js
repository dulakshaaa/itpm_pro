import icon1 from '../../assets/6.png'
import icon2 from '../../assets/6.png'
import icon3 from '../../assets/6.png'
import icon4 from '../../assets/6.png'

const Home = () => {
    return ( 
        <>
            <div className="hero">
                <div className="heroText">
                    <h1>YOUR HEALTH</h1>
                    <h1>IS OUR MISSION </h1>
                </div>
            </div>
            <div className="middleContainer">
                <div className="middleContainerHeading">Your health, your community, our commitment , care that connects and transforms lives</div>
                <div className="middleContainerText">Innovative healthcare system transforming lives through compassionate, advanced medical care, connecting patients with expert professionals who prioritize individual wellness.</div>
            </div>
            <div className="ourServices">
                <div className="ourServicesElement">
                    <div className="ourServicesElementImage"><img src={icon1} alt="" /></div>
                    <div className="ourServicesElementText">Long-term Care</div>
                </div>
                <div className="ourServicesElement">
                    <div className="ourServicesElementImage"><img src={icon2} alt="" /></div>
                    <div className="ourServicesElementText">Online Store</div>
                </div>
                <div className="ourServicesElement">
                    <div className="ourServicesElementImage"><img src={icon3} alt="" /></div>
                    <div className="ourServicesElementText">Treaments</div>
                </div>
                <div className="ourServicesElement">
                    <div className="ourServicesElementImage"><img src={icon4} alt="" /></div>
                    <div className="ourServicesElementText">Medicine</div>
                </div>
            </div>
            {/* <div className="contactUs">

            </div> */}
        </>
     );
}
 
export default Home;