import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {FormattedMessage} from 'react-intl'
import {reduxForm} from 'redux-form'

import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'
import CardActions from 'material-ui/lib/card/card-actions'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RaisedButton from 'material-ui/lib/raised-button'

import TextField from './fields/Text'
import SelectField from './fields/Select'
import CityField from './fields/City'

import currencies from '../resources/currencies'
import {TRIBE_TYPES} from '../constants/product'

import styles from '../constants/styles'

import validator from '../utils/formValidator'

import submitTribe from '../actions/submitTribe'

const currencyItems = currencies.map((item) =>
  <MenuItem value={item.code} key={item.code} primaryText={`${item.name} (${item.code})`} />
)
const typeItems = TRIBE_TYPES.map((type) =>
  <MenuItem value={type} key={type} primaryText={type} />
)

class TribeForm extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    this.props.handleSubmit(submitTribe)(event)
      .catch((errors) => {
        const field = Object.keys(errors)[0]
        if (field !== '_error') {
          this.refs[field].focus()
        }
      })
  }

  render() {
    const {fields: {tribe_name, tribe_type, city, currency}, error, submitting} = this.props

    return (
      <form onSubmit={this.handleSubmit}>
        <CardText>
          <TextField ref="tribe_name"
            floatingLabelText="Tribe name"
            required={true}
            errorText={tribe_name.touched && tribe_name.error && <FormattedMessage id="error.tribe_name" />}
            {...tribe_name}
          />
          <SelectField ref="tribe_type"
            floatingLabelText="Type"
            errorText={tribe_type.touched && tribe_type.error && <FormattedMessage id="error.tribe_type" />}
            {...tribe_type}
          >
            {typeItems}
          </SelectField>
          <CityField ref="city"
            floatingLabelText="City"
            required={true}
            errorText={city.touched && city.error && <FormattedMessage id="error.city" />}
            lang={this.props.lang}
            {...city}
          />
          <SelectField ref="currency"
            floatingLabelText="Currency"
            errorText={currency.touched && currency.error && <FormattedMessage id="error.currency" />}
            {...currency}
          >
            {currencyItems}
          </SelectField>
        </CardText>
        <CardActions style={styles.actions}>
          <RaisedButton label="Save profile" type="submit" disabled={submitting} />
          <p className="error">
            {error && <FormattedMessage id={error} />}
          </p>
        </CardActions>
      </form>
    )
  }
}

TribeForm.propTypes = {
  // from redux-form:
  fields: PropTypes.object,
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  // from redux state:
  initialValues: PropTypes.object,
  lang: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  initialValues: {
    currency: state.member.tribe.currency,
  },
  lang: state.app.lang,
})

export default reduxForm({
  form: 'tribe',
  fields: ['tribe_name', 'tribe_type', 'city', 'currency'],
  returnRejectedSubmitPromise: true,
  validate: validator.tribe,
}, mapStateToProps)(TribeForm)