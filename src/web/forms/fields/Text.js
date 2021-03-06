import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import TextField from 'material-ui/TextField'

import styles from '../../styles'

class TextFieldWrapper extends Component {
  static propTypes = {
    touched: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  constructor(props) {
    super(props)
    this.ref = this.ref.bind(this)
    this.focus = this.focus.bind(this)
  }

  ref(element) {
    this.element = element
  }

  focus() {
    this.element.focus()
  }

  render() {
    return (
      <TextField
        ref={this.ref}
        style={styles.field}
        floatingLabelText={<FormattedMessage id={'field.' + this.props.name} />}
        errorText={this.props.touched && this.props.error && <FormattedMessage id={'error.' + this.props.name} />}
        {...this.props}
      />
    )
  }
}

export default TextFieldWrapper
