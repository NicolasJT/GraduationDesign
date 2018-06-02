import React from 'react';
import { Form, Input, Icon, Button, Checkbox } from 'antd';
import { addUser } from '@/axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
const FormItem = Form.Item;
class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false
  };
  componentWillReceiveProps(nextProps){
        const {auth: nextAuth = {}} = nextProps;
        const {history} = this.props;
        if(nextAuth.data && nextAuth.data.uid){

            localStorage.setItem('user', JSON.stringify(nextAuth.data));
            history.push('/');
        }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        console.log('-=-=-=');
        let userId = await addUser(values); 
        const { fetchData } = this.props;
        console.log('userid', userId);
        console.log(values);
        if(values.shopKeeper)
            fetchData({funcName: 'shopKeeper', stateName: 'auth', userId: userId});
        if(values.truckKeeper)
            fetchData({funcName: 'truckKeeper', stateName: 'auth', userId: userId});
        if(values.admin)
            fetchData({funcName: 'admin', stateName: 'auth', userId: userId});        
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className = "register">
            <div className = "register-form">
                <div className = "register-logo">
                    <span>Register</span>
                </div>
                <Form onSubmit={this.handleSubmit} style = {{maxWidth: '400px'}}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: 'The input is not valid E-mail!',
                    }, {
                      required: true, message: 'Please input your E-mail!',
                    }],
                  })(
                    <Input prefix = {<Icon type = "mail" style = {{fontsize: 13}} /> } placeholder = "your email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: 'Please input your password!',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                  })(
                    <Input type="password" prefix = {<Icon type = "lock" style = {{fontsize: 13}} /> } placeholder = "your password" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: 'Please confirm your password!',
                    }, {
                      validator: this.compareToFirstPassword,
                    }],
                  })(
                    <Input type="password" prefix = {<Icon type = "lock" style = {{fontsize: 13}} /> } placeholder = "confirm password" onBlur={this.handleConfirmBlur} />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                  })(
                    <Input prefix = {<Icon type = "user" style = {{fontsize: 13}} /> } placeholder = "your name" />
                  )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('shopKeeper', {
                        valuePropName: 'shopKeeper',
                        initialValue: false,
                    })(
                        <Checkbox>shopKeeper</Checkbox>
                    )}
                    {getFieldDecorator('truckKeeper', {
                        valuePropName: 'truckKeeper',
                        initialValue: false,
                    })(
                        <Checkbox>truckKeeper</Checkbox>
                    )}
                    {getFieldDecorator('admin', {
                        valuePropName: 'admin',
                        initialValue: false,
                    })(
                        <Checkbox>admin</Checkbox>
                    )}
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                    注册
                    </Button>
                </FormItem>
                </Form>
            </div>
        </div>

    );
  }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

const WrappedRegistrationForm = connect(mapStateToPorps, mapDispatchToProps)(Form.create()(RegistrationForm));

export default WrappedRegistrationForm;