import React, {Component, PropTypes} from 'react'
import {StyleSheet, Platform, UIManager} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import SortableListView from 'react-native-sortable-listview'

import PageView from '../hoc/PageView'
import Note from '../components/Note'
import Fab from '../components/Fab'
import Empty from '../components/Empty'

import listenNotes from '../../common/actions/listenNotes'
import postNote from '../../common/actions/postNote'
import moveNote from '../../common/actions/moveNote'
import putNotes from '../../common/actions/putNotes'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

class Notes extends Component {
  static propTypes = {
    // redux state:
    tid: PropTypes.string,
    notes: PropTypes.array.isRequired,
    // action creators:
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    postNote: PropTypes.func.isRequired,
    moveNote: PropTypes.func.isRequired,
    putNotes: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.load = this.load.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.handleFab = this.handleFab.bind(this)
    this.ref = this.ref.bind(this)
    this.handleMove = this.handleMove.bind(this)
  }

  componentDidMount() {
    this.load(this.props.tid)
  }

  componentWillReceiveProps(props) {
    this.load(props.tid)
  }

  componentWillUnmount() {
    this.props.unsubscribe()
  }

  load(tid) {
    if (tid && this.tid !== tid) {
      this.tid = tid
      this.props.subscribe()
    }
  }

  ref(el) {
    this.el = el
  }

  handleFab() {
    const lastNote = this.props.notes[0]

    this.props.postNote({
      title: '',
      content: '',
      position: lastNote ? lastNote.position - 1 : 0,
    })
  }

  handleMove(event) {
    this.props.moveNote({
      draggedNote: event.row.data,
      from: event.from,
      to: event.to,
    })
    this.el.forceUpdate()
    this.props.putNotes()
  }

  renderRow(row) {
    return <Note note={row} />
  }

  render() {
    const {notes} = this.props

    let content
    if (notes.length) {
      content = (
        <SortableListView
          ref={this.ref}
          style={styles.list}
          data={notes}
          renderRow={this.renderRow}
          onRowMoved={this.handleMove}
          keyboardShouldPersistTaps={true}
        />
      )
    } else {
      content = <Empty name="notes" />
    }

    return (
      <PageView>
        {content}
        <Fab name="add" onPress={this.handleFab} type="notes" />
      </PageView>
    )
  }
}

const mapStateToProps = (state) => ({
  tid: state.tribe.id,
  notes: state.notes.items,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  subscribe: listenNotes.on,
  unsubscribe: listenNotes.off,
  postNote,
  moveNote,
  putNotes,
}, dispatch)

const styles = StyleSheet.create({
  list: {
    //TODO: add 4px at the begining
    //TODO: add space at the end for FAB
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Notes)
