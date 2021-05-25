import {useState, useEffect  } from 'react';
import {Jumbotron, Button, OverlayTrigger,Tooltip, Modal, Form,Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from '../commons/axios.js';
import { message, Typography ,Layout, Menu, } from 'antd';
import Header from '../components/header.js';

function App(props) { 
    const [customer, setCustomer] = useState();
    
    const[lat,setLat] = useState('');
    const[lng,setLng] = useState('');
    const[vendors,setVendors] = useState([]);
    
    useEffect(() =>{
      if(props.location.state){
        setCustomer(props.location.state.customer)
      }else{
        setCustomer(null)
      }
      navigator.geolocation.getCurrentPosition(function (position){
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      });
      axios.get('/vendor?lat='+lat+'&lng='+lng).then(response =>{
        setVendors(response.data.vendors)
      })
    },[lat,lng])
  
    const renderTooltip = (props) => (
      <Tooltip id = 'button-tooltip' {...props}>
        feature still in progess
      </Tooltip>
    );

    const onSkip = () =>{
      props.history.push('/customer',{
        position:[lat, lng],
        vendors: vendors
      });
    }
    
    return (
      <div>
        <Header customer = {customer}/>
        <Jumbotron style = {{background: "white" , width: '40%', margin :'auto', marginTop: '10%'}}>
          <h1> 
          <img alt="" src="/coffee-truck.png" width="70" height="50" className="d-inline-block align-top"/>
          Welcome to Le Sillage!
          </h1>
          <p>
          Tell me more about the van。
          </p>
          <p>
            <Button variant = "outline-dark" onClick = {onSkip}>Customer</Button>
          </p>
        </Jumbotron>
      </div>
    )
} 

export default App;