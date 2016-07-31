import React, {Component, PropTypes} from 'react'
import {Dimensions, View, Image, StyleSheet} from 'react-native'

import ScrollableTabView from 'react-native-scrollable-tab-view'

import TabBar from '../components/TabBar'

const windowWidth = Dimensions.get('window').width
const headerHeight = windowWidth * 412 / 1000

class TabView extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.renderTabBar = this.renderTabBar.bind(this)
  }

  renderTabBar(props) {
    const badges = this.props.children.map((child) => child.props.badge)
    return <TabBar {...props} badges={badges} />
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../common/images/header.png')} resizeMode="cover" style={styles.image} />
        <ScrollableTabView renderTabBar={this.renderTabBar} {...this.props}>
          {this.props.children}
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: headerHeight,
    width: windowWidth,
    marginBottom: -50,
  },
})

export default TabView
