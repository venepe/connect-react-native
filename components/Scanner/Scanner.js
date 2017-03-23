/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Camera from 'react-native-camera';
import { connect } from 'react-redux';
import { onCapture } from '../../actions';

class Scanner extends Component {

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.state = {
      didCapture: false,
    }
  }

  goBack() {
    this.props.navigator.pop()
  }

  onBarCodeRead(result) {
    if (!this.state.didCapture && result.data && result.data.length > 0) {
      this.setState({
        didCapture: true,
      });
      console.log(result.data);
      let data = result.data;
      let payload = JSON.parse(data);
      this.props.onCapture({ payload });
      this.goBack();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          aspect={Camera.constants.Aspect.fill}>
          <View>
            <Text style={styles.capture} onPress={this.goBack}>Cancel</Text>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

export default connect(
  null,
  { onCapture }
)(Scanner);
