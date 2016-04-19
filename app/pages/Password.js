import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedHTMLMessage} from 'react-intl'

import {Card} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import PasswordForm from '../forms/Password'

import routes from '../constants/routes'

class Password extends Component {

  render() {
    return (
      <Card className="main">
        <PasswordForm />
        <Dialog
          actions={[<FlatButton label="OK" primary={true} containerElement={<Link to={routes.WELCOME} />} style={{textAlign: 'center'}} />]}
          open={this.props.sent}
        >
          <FormattedHTMLMessage id="sent_reset" />
        </Dialog>
      </Card>
    )
  }

}

Password.propTypes = {
  sent: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  sent: state.password.sent,
})

export default connect(mapStateToProps)(Password)
