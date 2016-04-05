import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import TextField from 'material-ui/lib/text-field'

import IconButton from 'material-ui/lib/icon-button'
import AddIcon from 'material-ui/lib/svg-icons/content/add'
import RemoveIcon from 'material-ui/lib/svg-icons/content/remove'
import * as colors from 'material-ui/lib/styles/colors'

import MoneyField from '../fields/Money'

export default class Part extends Component {

  //TODO: pure rendering?

  constructor(props) {
    super(props)
    this.handleRemoveShare = this.handleRemoveShare.bind(this)
    this.handleAddShare = this.handleAddShare.bind(this)
  }

  handleRemoveShare() {
    if (this.props.amount.value > 0) {
      this.props.amount.onChange(this.props.amount.value - 1)
    }
  }

  handleAddShare() {
    this.props.amount.onChange(this.props.amount.value + 1)
  }

  render() {
    const {user, amount, method, ...rest} = this.props

    if (!user) {
      return null // in cases users are not loaded yet
    }

    const labelStyle = {flexGrow: 1, marginTop: 24, fontSize: 16}
    const amountStyle = {whiteSpace: 'nowrap', marginLeft: 16, position: 'relative'}
    const buttonStyle = {verticalAlign: 'middle'}

    return (
      <div style={{display: 'flex', height: 72}}>
        <label style={labelStyle} htmlFor={'' + user.id}>
          {user.name}
        </label>
        {
          method === 'shares' ? (
            <div style={amountStyle}>
              <IconButton onTouchTap={this.handleRemoveShare} style={buttonStyle}>
                <RemoveIcon />
              </IconButton>
              <TextField
                style={{width: 100, marginTop: 10}}
                inputStyle={{textAlign: 'center'}}
                type="number"
                step="1"
                min="0"
                max="10"
                {...amount}
              />
              <IconButton onTouchTap={this.handleAddShare} style={buttonStyle}>
                <AddIcon />
              </IconButton>
            </div>
          ) : (
            <div style={amountStyle}>
              <TextField
                style={{width: 150, marginTop: 10}}
                inputStyle={{width: 100}}
                type="number"
                step="0.01"
                min="0"
                {...amount}
                //TODO: show currency
              />
              <div style={{position: 'absolute', top: 26, right: 4, color: colors.grey300}}>
                {this.props.currency}
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

Part.propTypes = {
  // from parent form:
  user: PropTypes.object,
  amount: PropTypes.object.isRequired,
  currency: PropTypes.string,
  method: PropTypes.string.isRequired,
}
