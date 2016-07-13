import React, {Component, PropTypes} from 'react'
import {View, Text, Linking, StyleSheet} from 'react-native'

import {connect} from 'react-redux'

import TabView from '../hoc/TabView'
import AsyncContent from '../hoc/AsyncContent'
import Card from '../components/Card'
import Entry from '../components/Entry'
import IconButton from '../components/IconButton'
import FormattedMessage from '../components/FormattedMessage'

import config from '../../common/config'

class Activity extends Component {
  static propTypes = {
    // from redux:
    bot_token: PropTypes.string,
    unread: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.handleTelegram = this.handleTelegram.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  handleTelegram() {
    Linking
      .openURL('tg://resolve?domain=' + config.telegram_bot_name + '&start=' + this.props.bot_token)
      .catch(() => {
        Linking.openURL('https://telegram.me/' + config.telegram_bot_name + '?start=' + this.props.bot_token)
      })
  }

  renderFooter() {
    return (
      <View>
        <IconButton
          family="evil"
          name="sc-telegram"
          color="gray"
          onPress={this.handleTelegram}
          style={styles.telegram}
        >
          <FormattedMessage id="telegram" />
        </IconButton>
        <Text style={styles.version}>
          App version: beta {config.android.versionName} ({config.android.versionCode})
        </Text>
      </View>
    )
  }

  render() {
    const {unread} = this.props

    return (
      <View style={styles.container}>
        <TabView>
          <AsyncContent name="activity"
            rowComponent={Card}
            tabLabel="tab.activity"
            footer={this.renderFooter()}
          />
          <AsyncContent name="history"
            rowComponent={Entry}
            tabLabel="tab.history"
            badge={unread > 0 && unread}
          />
        </TabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
  },
  telegram: {
    alignSelf: 'center',
  },
  //TODO: remove (or move):
  version: {
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 10,
    height: 20,
  },
})

const mapStateToProps = (state) => ({
  bot_token: state.user.bot_token,
  unread: state.app.unread,
})

export default connect(mapStateToProps)(Activity)
