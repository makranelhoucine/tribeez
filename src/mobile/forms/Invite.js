import React, {Component, PropTypes} from 'react'

import ScrollView from '../hoc/ScrollView'
import Form from '../hoc/Form'
import TextField from './fields/Text'
import SelectField from './fields/Select'

import form from '../../common/forms/invite'
import submitInvite from '../../common/actions/submitInvite'
import langs from '../../common/constants/langs'

class InviteForm extends Component {
  static propTypes = {
    // from redux-form:
    fields: PropTypes.object,
    // from redux:
    initialValues: PropTypes.object,
  }

  render() {
    const {fields: {email, lang}, ...props} = this.props

    return (
      <ScrollView>
        <Form name="invite" action={submitInvite} {...props}>
          <TextField ref="email"
            {...email}
            autoCorrect={false}
            keyboardType="email-address"
            errorId={email.error && 'email_' + email.error}
            onSubmitEditing={this.handleSubmit}
          />
          <SelectField ref="lang"
            {...lang}
            items={langs}
          />
        </Form>
      </ScrollView>
    )
  }
}

export default form(InviteForm)
