import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Table, Popconfirm, Icon ,Input, notification } from 'antd';
import { management, postManagementObj, delMan } from '../../axios';
class EditableCell extends Component{
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        if(value === undefined){
        	return null; 
        }
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        );
    }
}
class Management extends Component {
	constructor(props) {
		super(props);
		this.columns = [{
			title: 'number',
			dataIndex: 'number',
			width: '30%',
			render: (text, record, index) => this.renderColumns(this.state.data, index, 'number', text),
		},
		{
			title: 'driver',
			dataIndex: 'driver',
			render: (text, record, index) => this.renderColumns(this.state.data, index, 'driver', text),
		},
		{
			title: 'tel',
			dataIndex: 'tel',
			render: (text, record, index) => this.renderColumns(this.state.data, index, 'tel', text),
		},
		{
			title: 'volume',
			dataIndex: 'volume',
			render: (text, record, index) => this.renderColumns(this.state.data, index, 'volume', text),
		},
		{
			title: 'operation',
			dataIndex: 'operation',
			width: '15%',
			render: (text, record, index) => {
				const { editable } = this.state.data[index].driver;
				return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                  <a onClick={() => this.editDone(index, 'save')}>Save</a>
                                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                                    <a>Cancel</a>
                                  </Popconfirm>
                                </span>
                                :
                                <span>
                                  <a onClick={() => this.edit(index)}>Edit</a>
                                </span>
                        }
                    </div>
                );
			}
		}
		];
		this.state = {
			selectedRowKeys: [],
			loading: false,
			data: [],
			count: 0
		};
	};
	componentDidMount(){
		this.start();
	};
	renderColumns(data, index, key, text) {
	    const { editable, status } = data[index][key];
	    if (typeof editable === 'undefined') {
	        return text;
	    }
	    return (
	        <EditableCell
	            editable={editable}
	            value={text}
	            onChange={value => this.handleChange(key, index, value)}
	            status={status}
	        />
	    );
	};
	handleChange(key, index, value) {
	    const { data } = this.state;
	    data[index][key].value = value;
	    this.setState({ data });
	};
	edit(index) {
	    const { data } = this.state;
	    Object.keys(data[index]).forEach((item) => {
	        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
	            data[index][item].editable = true;
	        }
	    });
	    this.setState({ data });
	};
	async editDone(index, type) {
	    const { data } = this.state;
	    Object.keys(data[index]).forEach((item) => {
	        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
	            data[index][item].editable = false;
	            data[index][item].status = type;
	        }
	    });
	    this.setState({ data }, () => {
	        Object.keys(data[index]).forEach((item) => {
	            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
	                delete data[index][item].status;
	            }
	        });
	    });
	    if(type === 'save'){
	    	const temp = data[index];
	    	console.log('########', res);
	    	let res = await postManagementObj(temp);
	    	notification.open({
	    		message: 'Saved!',
	    		description: res
	    	});
	    }
	    if(type === 'cancel'){
	    	this.start();
	    }
	}
	handleDel = () => {
		const { selectedRowKeys } = this.state;
		delMan(selectedRowKeys).then(res => {
			if(res){
				this.start();
				notification.open({
					message: 'deleted!',
					description: res
				});
			}
		});
	};
	handleAdd = () => {
		const { count, data } = this.state;
		const newData = {
			key: count + 1,
			number: {
				editable: true,
				value: 'number',
			},
			driver: {
				editable: true,
				value: 'driver'
			},
			tel: {
				editable: true,
				value: 'tel'
			},
			volume: {
				editable: true,
				value: 0
			}
		}
		this.setState({
			data: [newData, ...data],
			count: count + 1
		});
	};
	start = () => {
		this.setState({loading: true});
		management().then(management_data => {
			const len = management_data.length;
			this.setState({
				data: management_data,
				loading: false,
				count: management_data[len -1].key
			})			
		});
	};
	onSelectedChange = (selectedRowKeys) => {
		this.setState({selectedRowKeys});
	};
	render(){
		const {loading, selectedRowKeys} = this.state;
		const columns = this.columns;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		const { data } = this.state;
		const dataSource = data.map(item => {
			const obj = {};
			Object.keys(item).forEach(key => {
				obj[key] = key === 'key' ? item[key] : item[key].value;
			});
			return obj;
		})
		return (
			<div className="gutter-example">
				<BreadcrumbCustom first="车辆维护" />
				<Row gutter = {16}>
					<Col className = "gutter-row" md = {24}>
						<div className = "gutter-box">
							<Card bordered = {false}>
								<Icon type = "plus" onClick = {this.handleAdd} />
								<Icon type = "minus" style={{ marginLeft: 8 }} onClick = {this.handleDel} />
								<Icon type = "reload" style = {{float: 'right'}} onClick = {this.start} disabled = {loading} />
								<span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
								<Table 
									bordered
									rowSelection = {rowSelection}
									dataSource = {dataSource}
									columns = {columns}
								/>
							</Card>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}

export default Management;