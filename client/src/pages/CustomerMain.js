import {useState, useEffect} from 'react';
import {Button, Navbar, Nav,  Modal} from 'react-bootstrap';
import {Divider, Drawer, Row, Col, Card, InputNumber} from 'antd';
import 'antd/dist/antd.css';
import '../pages/main.css';

import axios from "../commons/axios"
import Layout, { Footer } from 'antd/lib/layout/layout';
import OrderList from '../components/OrderList.js';
import { message } from 'antd'; 
import {useHistory} from 'react-router-dom';
import Header from '../components/header';



const{Meta}= Card;
function onChange(value) {
    console.log('changed', value);
  }


export default function CustomerMain(props) {

    //initial the constant that is used in presentation
    const [drawerVisible, setDrawerVisible] = useState(false); 
    const handleDrawerClose = () => setDrawerVisible(false); 
    const handleDrawerShow = () => setDrawerVisible(true); 
    const[modalVisible, setModalVisible]= useState(props.modalVisible);
    const handleModalShow = () => setModalVisible(true);
    const handleModalClose = () => setModalVisible(false);

    //initial the constant that will used to stored data from db or previous pages     
    const [snacks, setSnacks] = useState([]);
    const[orders, setOrders] = useState([]);
    const[order, setOrder] = useState([]);
    
    
    const onChange = (index, event) => {
        let newArray = [...order];
        newArray[index] = event;
        setOrder(newArray);
    }

    //not log in -> push  back to the login page
    let history = useHistory();
    const onSubmit = () => {
        if (!props.location.state.customer){
            message.error("Sorry, you have to login before ordering")
            setModalVisible(false);
            history.push(props.location.pathname,{
                customer: props.location.state.customer
            })

        }else{
        // change the order format and store in the db "orders" cluster
        var submitOrder = []
        for (var i = 0; i < order.length; i++){
            if(Number.isFinite(order[i])){
                submitOrder.push({
                    "name":snacks[i].name,
                    "qty":order[i]
                })
            }
        }
        if (submitOrder.length ===0){
            setModalVisible(false)
            message.error("Sorry, you cannot enter empty snacks~")
        }else{
            // post the order info 
            axios.post('/order/create',{
                customer: props.location.state.customer.id,
                vendor:props.location.state.vendor.id, 
                snacks: submitOrder
            }).then(response =>{
                if(response.data.success){
                    message.success("Congrats! Your order is received and you can pick up later!")
                    setModalVisible(false)
                }else{
                    message.error("Sorry, your order is failed to record! Please try again later!")
                }
            })
        }
    }
}

    // can check processing order that ordered by this customerID
    useEffect(() => {
        if(props.location.state.customer){
            axios.get('/order?customer=' + props.location.state.customer.id).then(response => {
                setOrders(response.data.allOrders)
            })
        }
        axios.get('/snack').then(response => {
            setSnacks(response.data.snacks)
        })
        
    },[props.location.state.customer]); 
    


    //front end design
    return (
        <>
            <Layout>
                <Header customer = {props.location.state.customer}
                        vendor = {props.location.state.vendor}/>
                <Navbar>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    </Navbar.Collapse>
                    <Nav class="justify-content-end">
                    <Button variant="outline-dark" size="lg"
                            onClick={handleModalShow}>My Cart</Button>
                        <Modal show={modalVisible} onHide={handleModalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>My cart</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {snacks.map((snack, index) =>(
                                    <Card style={{marginBottom:"2vh"}}size={"small"} key={snack._id}>
                                        <Meta
                                            title={snack.name + "    " + snack.price}
                                        />
                                        <Divider style={{borderWidth:5, borderColor: '#593e34' }} plain>
                                        </Divider>
                                        <Meta/>
                                        <InputNumber key ={snack._id} min={0} defaultValue={0} style ={{marginLeft:"80%"}} onChange={e => onChange(index, e)} />
                                            
                                    </Card>
                                ))}

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="dark" onClick={onSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Nav>
                </Navbar>

                <div id="menu-container">
                    <Row id="Coffee-Row">
                        <Divider orientation="left" style={{borderWidth:2, borderColor: '#593e34' }} plain>
                            <h2>Snacks - Le Sillage</h2>
                        </Divider>
                    {snacks.map((snack, index) =>(
                        <Col span={8}>
                        <Card id="coffeemenu" hoverable
                                cover={<img alt="" src={snack.image} ></img>}
                            >
                                <Meta title={snack.name + "    " + snack.price}/>
                            </Card>
                        </Col>
                    ))}
                    </Row>
                </div>
                <Footer>
                    <Divider orientation="center" style={{borderWidth:2, borderColor: '#593e34' }} plain>
                        <h2>Le Sillage</h2>
                    </Divider>
                </Footer>
            </Layout>
        </>
    )
}