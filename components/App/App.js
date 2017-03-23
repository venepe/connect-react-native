/**
 * @flow
 */
 
import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Home from '../../components/Home';

class App extends Component {

  renderScene(route, navigator) {
    let Component = route.component;

    return (
      <View style={{ flex: 1, }}>
        <Component navigator={navigator} route={route} />
      </View>
    );
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene}
        configureScene={(route) => {
         if (route.sceneConfig) {
           return route.sceneConfig;
         }
         return Navigator.SceneConfigs.FloatFromBottom;
       }}
        initialRoute={{
          component: Home,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
