import React, {Component, PropTypes} from 'react'
import {View, ScrollView, Linking, StyleSheet} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ScrollableTabView from 'react-native-scrollable-tab-view'

import AsyncContent from '../hoc/AsyncContent'
import Card from '../components/Card'
import Entry from '../components/Entry'
import IconButton from '../components/IconButton'
import FormattedMessage from '../components/FormattedMessage'

import config from '../../common/config'
import colors from '../../common/constants/colors'
import getActivity from '../../common/actions/getActivity'
import getHistory from '../../common/actions/getHistory'

class Activity extends Component {
  static propTypes = {
    // from redux:
    activity: PropTypes.object,
    history: PropTypes.object,
    telegram_token: PropTypes.string,
    // action creators:
    getActivity: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleTelegram = this.handleTelegram.bind(this)
  }

  componentDidMount() {
    this.props.getActivity()
  }

  handleTelegram() {
    Linking
      .openURL('tg://resolve?domain=' + config.telegram_bot_name + '&start=' + this.props.telegram_token)
      .catch(() => {
        Linking.openURL('https://telegram.me/' + config.telegram_bot_name + '?start=' + this.props.telegram_token)
      })
  }

  render() {
    const {activity, history} = this.props

    return (
      <View style={styles.container}>
        <ScrollableTabView
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor="white"
          tabBarUnderlineColor="white"
          tabBarBackgroundColor={colors.main}
        >
          <ScrollView tabLabel="WHAT'S UP" style={styles.content}>
            {
              activity.items.map((item, index) => (
                <Card key={index} item={item} />
              ))
            }
            <IconButton
              family="evil"
              name="sc-telegram"
              color="gray"
              onPress={this.handleTelegram}
              style={styles.telegram}
            >
              <FormattedMessage id="telegram" />
            </IconButton>
          </ScrollView>
          <AsyncContent
            data={history}
            fetcher={this.props.getHistory}
            rowComponent={Entry}
            tabLabel="HISTORY"
          />
        </ScrollableTabView>
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
    paddingVertical: 24,
    alignSelf: 'center',
  },
})

const mapStateToProps = (state) => ({
  activity: state.activity,
  history: state.history,
  telegram_token: state.member.user.telegram_token,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getActivity,
  getHistory,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
