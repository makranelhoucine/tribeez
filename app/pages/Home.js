import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeActions } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import Activity from '../components/Activity'

import getActivity from '../actions/getActivity'

class Home extends Component {

  componentWillMount() {
    this.props.getActivity(0, 10)
  }

  render() {
    return (
      <div>
        {
          this.props.entries.map(entry => <Activity entry={entry} key={entry.id} />)
        }
      </div>
    )
  }

}

Home.propTypes = {
  entries: PropTypes.array,
}

const mapStateToProps = (state) => ({
  entries: state.activity.entries,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getActivity,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)