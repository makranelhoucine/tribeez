import React, {Component, PropTypes} from 'react'
import {Dimensions, View, ScrollView, StyleSheet} from 'react-native'

import Header from '../components/Header'

import {marginTop, navBarHeight} from '../dimensions'

const SCROLL_TRIGGER = Header.height - (navBarHeight + marginTop)

class ScrollViewWithHeader extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      scrolled: false,
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll(event) {
    const scrolled = event.nativeEvent.contentOffset.y > SCROLL_TRIGGER

    if (this.state.scrolled !== scrolled) {
      this.setState({
        scrolled,
      })
    }
  }

  render() {
    const stickyStyle = {position: 'absolute', top: this.state.scrolled ? -SCROLL_TRIGGER : -500}
    const headerStyle = {opacity: this.state.scrolled ? 0 : 1}

    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps={true} onScroll={this.handleScroll} contentContainerStyle={styles.content}>
          <Header.Image style={headerStyle} />
          <Header.Shadow style={headerStyle} />
          {this.props.children}
        </ScrollView>
        <View style={stickyStyle}>
          <Header.Image />
          <Header.Shadow />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    minHeight: Dimensions.get('window').height,
  },
})

export default ScrollViewWithHeader
