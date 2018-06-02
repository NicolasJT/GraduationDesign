import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import Tencent from './map/Tencent';
import { Row, Col, Card } from 'antd';

class Dashboard extends React.Component {

    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Row gutter={16}>
                    <Col md={24}>
                        <div style={{height: 500}}>
                            <Card bordered={false} >
                                <Tencent />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;