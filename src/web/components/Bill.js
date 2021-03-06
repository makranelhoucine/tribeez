import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import EditButton from 'material-ui/svg-icons/image/edit'
import DeleteButton from 'material-ui/svg-icons/action/delete'
import * as colors from 'material-ui/styles/colors'

import Link from '../components/Link'

import gravatar from '../../common/utils/gravatar'

import routes from '../routes'

class Bill extends Component {
  static propTypes = {
    // from parent component:
    bill: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    // from redux:
    uid: PropTypes.string,
    userMap: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete() {
    this.props.onDelete(this.props.bill)
  }

  render() {
    const {bill, userMap} = this.props

    // to render a bill, the userMap must be loaded for the current tribe bills
    const user = userMap[bill.payer]
    if (!user) {
      return null
    }

    const user_part = bill.parts[this.props.uid]

    const total = <FormattedNumber value={bill.amount} format="money" />

    let formatted_part
    if (user_part) {
      formatted_part = <FormattedMessage id="bill.mypart" values={{amount: user_part}} />
    } else {
      formatted_part = <FormattedMessage id="bill.nopart" />
    }
    const title = <span>{total} — {bill.name}</span>
    const date = <FormattedDate value={bill.paid} day="numeric" month="long" year="numeric" />

    return (
      <Card style={styles.container}>
        <CardHeader title={title} subtitle={<span>{date} — {formatted_part}</span>}
          style={{height: 'auto', whiteSpace: 'nowrap'}}
          textStyle={{whiteSpace: 'normal', paddingRight: '90px'}}
          avatar={gravatar(user)}
          actAsExpander={true} showExpandableButton={true}
        />
        <CardText expandable={true} style={{paddingTop: 0}}>
          {bill.description}
          <List>
            {
              Object.keys(bill.parts).map((part_uid) => {
                const part_amount = bill.parts[part_uid]
                const part_user = userMap[part_uid]

                return (
                  <ListItem key={part_uid} leftAvatar={<Avatar src={gravatar(part_user)} />} disabled={true}>
                    <FormattedNumber value={part_amount} format="money" />
                  </ListItem>
                )
              })
            }
          </List>
        </CardText>
        <CardActions expandable={true} style={{textAlign: 'right', marginTop: '-50px'}}>
          <IconButton containerElement={<Link to={{pathname: routes.BILLS_EDIT.replace(':id', bill.id), state: bill}} />}>
            <EditButton color={colors.grey600} />
          </IconButton>
          <IconButton onTouchTap={this.handleDelete}>
            <DeleteButton color={colors.red400} />
          </IconButton>
        </CardActions>
      </Card>
    )
  }
}

const styles = {
  container: {
    margin: '15px 10px 0',
  },
}

const mapStateToProps = (state) => ({
  uid: state.user.uid,
  userMap: state.tribe.userMap,
})

export default connect(mapStateToProps)(Bill)
