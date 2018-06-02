import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Table } from 'antd';
import { distribute } from '../../axios';

class Distr extends Component{
	constructor(props){
		super(props);
		this.colume = [{
			title: 'car',
			dataIndex: 'car',			
		},
		{
			title: 'storename',
			dataIndex: 'storename',
		}];
		this.state = {
			data: []
		}
	}
	componentDidMount(){
		this.start();
	};
	start(){
		distribute().then(data => {
			console.log(data);
			let res = [];
			for(let i=0;i<data.length;i++){
				let obj = {
					key: i,
					car: data[i].car.number,
					storename: data[i].storename[0].name
				}
				console.log(obj);
				res.push(obj);
			}
			this.setState({
				data: res
			})
		})
	}
	render(){
		const { data } = this.state;
		const colume = this.colume;
		return (
			<div className = "gutter-example">
				<BreadcrumbCustom first="车辆分配" />
				<Row gutter={16}>
				    <Col className="gutter-row" md={24}>
				        <div className="gutter-box">
				            <Table
				            	bordered
				            	dataSource = {data}
				            	columns = {colume}
				            />
				        </div>
				    </Col>
				</Row>
			</div>
		)
	}
}
export default Distr;