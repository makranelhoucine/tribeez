import React, {Component, PropTypes} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'

import {connect} from 'react-redux'

import FormattedMessage from './FormattedMessage'

import routes from '../../common/routes'
import router from '../../common/router'
import colors from '../../common/constants/colors'
import gravatar from '../../common/utils/gravatar'

class Task extends Component {
  static propTypes = {
    // from redux:
    uid: PropTypes.number,
    users: PropTypes.array.isRequired,
    currency: PropTypes.string,
    // from parent:
    task: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress() {
    const route = routes.TASK
    route.item = this.props.task
    router.push(route)
  }

  render() {
    const {task} = this.props

    // to render a task, the users must be loaded for the current tribe tasks
    const author = this.props.users.find((u) => u.id === task.author_id)
    if (!author) {
      return null
    }

    let subtitle
    if (task.done) {
      subtitle = <FormattedMessage id="last_done" values={{ago: task.done}} />
    } else {
      subtitle = <FormattedMessage id="never_done" />
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handlePress} style={styles.main}>
          <Image
            source={{uri: gravatar(author)}}
            style={styles.avatar}
          />
          <View style={styles.titles}>
            <Text style={styles.title}>{task.name}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  uid: state.member.user.id,
  users: state.member.tribe.users,
  currency: state.member.tribe.currency,
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 5,
    elevation: 1,
  },
  main: {
    padding: 10,
    flexDirection: 'row',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  titles: {
    flex: 1,
  },
  title: {
    color: colors.primaryText,
  },
  subtitle: {
    color: colors.secondaryText,
  },
})

export default connect(mapStateToProps)(Task)