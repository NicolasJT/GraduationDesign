import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Button, InputNumber, notification } from 'antd';
import { stockAll , subDemand } from '../../axios';
import AuthWidget from '../widget/autoWidget';
class purchase extends Component{
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			purchaseItem: [],
			len: 0
		}
	}
	componentDidMount(){
		this.start();
	};
	start(){
		this.setState({loading: true});
		stockAll().then(allStock => {
			allStock.forEach(item => {
				item.value = 0
			});
			this.setState({
				loading: false,
				purchaseItem: allStock,
				len: allStock.length
			})
		})

	}
	subData = async data => {
		const res = await subDemand(data);
		console.log('0.0', res);
		notification.open({
			message: '提交成功!',
			description: res
		});
	}
	handleSubmit = () => {
		const demand = [];
		const uid = this.uid;
		let node = this.dataNode.props.children;
		node.forEach(item => {
			const name = item.props.children.props.children.props.children.props.children[0].props.children;
			const count = item.props.children.props.children.props.children.props.children[1].props.value;
			demand.push({
				name: name,
				count: count
			});
		})
		const data = {
			id: uid,
			demand: demand
		}
		console.log('data', data);
		this.subData(data);
	} 
	handleChange = (value, index) => {
		const {purchaseItem} = this.state;
		purchaseItem[index].value = value;
		this.setState({
			purchaseItem: purchaseItem
		})
	}
	render(){
		const { purchaseItem } = this.state;
		console.log(purchaseItem);
		return (
			<div className = "gutter-example button-demo">
				<BreadcrumbCustom first="需求提交" />
				<AuthWidget
					children = { auth => (
						<div>
							<Row className = "mb-m" >
								<Button onClick = {this.handleSubmit} >submit</Button>
							</Row>
							<Row gutter = {14} ref = { (demand) => { this.dataNode = demand; this.uid = auth.uid }} >
								{
									purchaseItem.map((v, i) => (
										<Col className = "gutter-row" md = {6} key = {i}>
											<div className = "gutter-box">
												<Card>
													<div className = "pa-m text-center" >
														<h3>{ v.name }</h3>
														<InputNumber defaultValue = {0} 
															max = {v.count} 
															min = {0} 
															onChange = {value => {this.handleChange(value, i)}} 
															value = {v.value}
														/>											 
													</div>
												</Card>
											</div>
										</Col>
									))
								}
							</Row>
						</div>
					)}	
				/>	
			</div>
		)
	}
}
export default purchase;