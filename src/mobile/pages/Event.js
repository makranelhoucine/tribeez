import React, {Component} from 'react'
import {ScrollView} from 'react-native'

import EventForm from '../forms/Event'

class Event extends Component {
  render() {
    return (
      <ScrollView>
        <EventForm />
      </ScrollView>
    )
  }

}

export default Event