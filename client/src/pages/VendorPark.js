import React from 'react'
import LeafletMap  from '../components/LeafletMap.js';
import Header from '../components/header';


export default function VendorPark(props) {
    return (
        <div>
            <Header/>
            <LeafletMap center = {props.location.state.position}
                        vendor = {props.location.state.vendor}
                        vendors = {[]}//如果传进来，可以获得最近的小车车
                        />
        </div>
    )
}