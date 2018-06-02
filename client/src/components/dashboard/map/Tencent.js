import React from 'react';
import ReactQMap from 'react-qmap';
import { Select, notification, Col, Card, Icon } from 'antd';
import { distribute } from '../../../axios';
const Option = Select.Option;

let classMap, windowMap, drivingService; //windowsMap <=> qq.maps
class TencentMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            selectcar: {},
            selected: false
        }
    }
    pos = (lat, lng) => {
        return new windowMap.LatLng(lat, lng);
    }
    getMap = (map, wMap) => {
        classMap = map;
        windowMap = wMap;
        drivingService = new wMap.DrivingService({
            map: map
        });
        console.log('get map has run------');
    }
    drawPath(start, end, policy){
        drivingService.setPolicy(windowMap.DrivingPolicy[policy]);
        drivingService.setLocation('合肥');
        drivingService.setComplete(result => {
            if(result.type == windowMap.ServiceResultType.MULTI_DESTINATION){
                let d = result.detail;
                drivingService.search(d.start[0], d.end[0]);
            }
        });
        drivingService.setError(data => {
            console.log('driving err!', data);
        });
        drivingService.search(start, end);
    }
    componentDidMount(){
        this.start();   
    }
    start(){       
        distribute().then(data => {
            this.setState({
                data: data
            })
        })
    }
    setCar(car){
        console.log('you chose car', car);
        this.setState({
            selectcar: car,
            selected: true
        });
    }
    getRoute(pos, policy){
        const center = this.pos(31.7714300000, 117.2041800000);
        let { selected } = this.state;
        if(selected){
            let destination = this.pos(pos.lat, pos.lon);
            this.drawPath(center, destination, policy);
        }else{
            notification.open({
                message: 'metion!',
                description: '请先选择一辆车'
            });
        }
    }
    render(){
        let { data, selectcar, selected } = this.state;
        console.log('--==--', data);
        return (
            <div>
                {
                    data.map((v, i) => (
                        <Col className = "gutter-row" md = {6} key = {i}>
                            <div className = "gutter-box" >
                                <Card onClick = { () => this.setCar(v)} >
                                    <Icon type = "car" />
                                    <span>{v.car.number}</span>
                                </Card>
                            </div>
                        </Col>
                    ))
                }
                <Select id = "policy" 
                        style = {{width: 120, float: "right"}} 
                        onChange = {value => {this.getRoute(selectcar.pos, value)}}
                >
                    <Option value = "LAST_TIME" >最少时间</Option>
                    <Option value = "LEAST_DISTANCE" >最短距离</Option>
                    <Option value = "AVOID_HIGHWAYS" >避开高速</Option>
                    <Option value = "REAL_TRAFFIC" >实时路况</Option>
                    <Option value = "PREDICT_TRAFFIC" >预测路况</Option>
                </Select>
                <span style = {{float: "right", fontSize: 16}} >  policy：</span>
                <span style = {{float: "right", fontSize: 16}} >{selected ? `you chose ${selectcar.car.number}  **` : ''}</span>
                <ReactQMap
                    center={{latitude: 31.7714300000, longitude: 117.2041800000}} 
                    initialOptions={{zoomControl: true, mapTypeControl: true}} 
                    apiKey="UN6BZ-MP2W6-XWCSX-M2ATU-QORGZ-OWFOE"
                    style={{height: 500}}
                    mySpot={{latitude: 31.7714300000, longitude: 117.2041800000}}
                    getMap = {(map, wMap) => this.getMap(map, wMap)}
                />
            </div>
 
        )
    }
}
export default TencentMap;