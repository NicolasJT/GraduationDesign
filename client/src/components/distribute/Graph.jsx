import React from 'react';
import ReactEcharts from 'echarts-for-react';

class Graph extends React.Component {
	data = {
		children: [
			{
				name: 'center', 
				children: [
					{
						name: 'store1',
						children: [{name: 'store2'}]
					},
					{
						name: 'store2'
					},
					{
						name: 'store3'
					}
				]
			}
		] 
	}
	state = {
		option: {
	        tooltip: {
	            trigger: 'item',
	            triggerOn: 'mousemove'
	        },
	        series: [
	            {
	                type: 'tree',

	                data: [this.data],

	                top: '18%',
	                bottom: '14%',

	                layout: 'radial',

	                symbol: 'emptyCircle',

	                symbolSize: 7,

	                initialTreeDepth: 3,

	                animationDurationUpdate: 750

	            }
	        ]
	    }
	}
	componentDidMount(){

	}
	render(){
		return(
			<ReactEcharts
				
			    option={this.state.option}
			    style={{height: '300px', width: '100%'}}
			    className={'react_for_echarts'}
			/>
		)
	}
}
export default Graph;