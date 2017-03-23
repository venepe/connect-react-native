/**
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  NativeAppEventEmitter,
  Navigator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import BleManager from 'react-native-ble-manager';
import base64 from 'base-64';
import Scanner from '../Scanner';
import { connect } from 'react-redux';
import { getBluetoothConnection } from '../../reducers';

class Home extends Component {

  static propTypes = {
    connection: PropTypes.shape({
      peripheralId: PropTypes.string,
      serviceUUID: PropTypes.string,
      characteristicUUID: PropTypes.string,
    }).isRequired
  }

  static defaultProps = {
    connection: {},
  }

  constructor(props) {
    super(props);
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.connect = this.connect.bind(this);
    this.state = {
      request: '',
      ble: null,
    };
  }

componentDidMount() {
  BleManager.start({showAlert: false});

  NativeAppEventEmitter
      .addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
          if (result) {
            console.log('Permission is OK');
          } else {
            PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log('User accept');
              } else {
                console.log('User refuse');
              }
            });
          }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.connection && nextProps.connection.peripheralId) {
      setImmediate(() => { this.connect(); });
    }
  }

  handleScan() {
      BleManager.scan([], 30, true)
          .then((results) => {console.log('Scanning...'); });
  }

  handleDiscoverPeripheral(data){
    console.log('Got ble data', data);
    this.setState({ ble: data })
  }

  connect() {
    BleManager.connect(this.props.connection.peripheralId)
    .then((peripheralInfo) => {
      // Success code
      console.log('Connected');
      console.log(peripheralInfo);
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });
  }

  writeWithoutResponse() {
    let connection = this.props.connection;
    let obj = {payload: this.state.request};
    let json = JSON.stringify(obj);
    let data = base64.encode(json);

    BleManager.writeWithoutResponse(connection.peripheralId, connection.serviceUUID,
                                      connection.characteristicUUID, data)
      .then(() => {
        // Success code
        console.log('Wrote: ' + data);
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });

      this.setState({
        request: '',
      });
  }

  onChangeRequest(request) {
    this.setState({
      request,
    });
  }

  render() {
    let text = this.props.connection.peripheralId ? 'Have' : 'Not';
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{title: 'Home'}}
          rightButton={{
            title: 'Connect',
            handler: () => {
              this.props.navigator.push({
                  sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                  component: Scanner,
                  passProps: {navigator}
              });
            },
            tintColor: '#212121',
          }}
        />
        <TextInput style={styles.textbox} placeholder={'Text to send to ble device'}
          onChangeText={this.onChangeRequest.bind(this)} value={this.state.request} autoFocus={false}
          keyboardType={'default'} returnKeyType={'done'} maxLength={150} autoCapitalize={'none'} />
        <TouchableHighlight style={styles.button} onPress={this.writeWithoutResponse.bind(this)} activeOpacity={.2} underlayColor={'#FCE4EC'}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  textbox: {
    height: 36,
    fontSize: 17,
    color: '#000000',
    margin: 15,
    borderWidth: 2,
    padding: 5,
    borderColor: '#BDBDBD',
  },
  button: {
    margin: 15,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E040FB',
  },
  buttonText: {
    fontSize: 18,
  },
});

const mapStateToProps = (state) => ({
  connection: getBluetoothConnection(state),
});

export default connect(
  mapStateToProps,
)(Home);
