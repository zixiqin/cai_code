import {Icon} from "leaflet";
import {useHistory} from "react-router-dom";
import React, {useState, useMemo} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {Button, Form, Modal} from 'react-bootstrap';
import {message} from 'antd';
import Menu from './Menu.js';
import axios from "../commons/axios"

export default function LeafletMap(props) {
    const vendorIcon = new Icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg',
        iconSize: [30,30]
    })

    let history = useHistory()
    const Log = (vendor) => {
        history.push('/menue',{
        customer : props.customer,
        vendor: vendor
    });}

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState(props.center)
    const eventHandlers = useMemo(
        (e)=> ({
            dragend(e){
                console.log(e.target.getLatLng())
                setPosition(e.target.getLatLng())
            },
            click(){
                handleShow()
            }
        }),
        [],
    )
    
    const onPark = () =>{
        console.log(props.vendor.id, position.lat, position.lng)
        axios.post('/vendor/park/' + props.vendor.id, {
            location: [position.lat, position.lng],
            textAddress: address
        }).then(response=>{
            message.success("vendor successfully parked")
            history.push({pathname: '/orders', state: {vendor: props.vendor}})
        })
    }

    const renderCustomerMarker = (
        <Marker position={props.center} iconUrl = {"https://static.thenounproject.com/png/780108-200.png"}>
                    <Popup>Your location is here </Popup>

                {
                    props.vendors.map((vendor) => (
                        <Marker position={vendor.location} icon = {vendorIcon}>
                            <Popup > {" distance to you is: " + 
                            (Math.sqrt(Math.hypot(
                                vendor.location[0] - props.center[0],
                                vendor.location[1] - props.center[1]
                                 ))*111).toFixed(2)+"km"}
                            <Button variant="primary" onClick={() =>Log(vendor)}>
                                Order from this Vendor
                            </Button>
                            </Popup>

                        </Marker>
                    ))
                }
        </Marker>
    )
    
    const renderVendorMarker = (
        // <Marker
        // draggable = {true}
        // eventHandlers = {eventHandlers}
        // position = {position}>
        // </Marker>
        <p>aaaa</p>
        

        
    )
        return (
        <>
            <Modal show = {show} onHide = {handleClose} style = {{marginTop: '2vh'}}>
                <Modal.Header closeButton>
                    <Modal.Title>Vendor Park</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Detailed Text address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address"
                                onChange={e => setAddress(e.target.value)} />
                            <Form.Text className="text-muted">
                                Plases enter the detailed address
                            </Form.Text>  
                        </Form.Group>
                    </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onPark}>
                    Submit
                </Button>
            </Modal.Footer>
            </Modal>

            
            <MapContainer 
            center={props.center} zoom={18} scrollWheelZoom={false} style={{height: "90vh"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'                  
                />
                {/* <Marker position={props.center} iconUrl = {"https://static.thenounproject.com/png/780108-200.png"}>
                    <Popup>Your location is here </Popup>
                </Marker>
                {
                    props.vendors.map((vendor) => (
                        <Marker position={vendor.location} icon = {vendorIcon}>
                            <Popup > {" distance to you is: " + 
                            (Math.sqrt(Math.hypot(
                                vendor.location[0] - props.center[0],
                                vendor.location[1] - props.center[1]
                                 ))*111).toFixed(2)+"km"}
                            <Button variant="primary" onClick={() =>Log(vendor)}>
                                Order from this Vendor
                            </Button>
                            </Popup>

                        </Marker>
                    ))
                } */}
                {(history.location.pathname ==='/vendor') ? renderCustomerMarker : <></>}
                {(history.location.pathname ==='/customer') ? renderCustomerMarker : <></>}
            </MapContainer>
        </>
    )
}