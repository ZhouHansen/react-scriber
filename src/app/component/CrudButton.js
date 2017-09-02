import React, {Component} from 'react'
import Spinner from 'react-spinkit'
import PropTypes from 'prop-types'
import $ from 'jquery'
import emitter from '../emitter'
import '../style/CrudButton.css'

class CrudButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fetch: false,
      save: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    let id = e.target.id
    let state = this.state[id] ? false : true

    const {store} = this.context

    $('#' + store.getState().draw.drawType).focus()

    this.setState({
      [id]: state
    })

    if (id === 'fetch'){
      emitter.emit('fetch')
    } else {
      emitter.emit('save')
    }

    // setTimeout has its own e, so we `let id = e.target.id` outside it.
    setTimeout(()=>{
      this.setState({
        fetch: false,
        save: false
      })
    }, 500)
  }

  render (){
    const Buttons = [
      {
        className: "btn btn-outline-primary crud",
        id: "fetch",
        text: "Fetch",
      },
      {
        className: "btn btn-outline-warning crud",
        id: "save",
        text: "Save",
      }
    ]

    return (
      <div>
        {Buttons.map(button =>
          <button
            type="button"
            className={button.className}
            id={button.id}
            key={button.id}
            onClick={this.handleClick}
            disabled={this.state.fetch||this.state.save}>
            {button.text}
            { this.state[button.id] &&
              <Spinner spinnerName='three-bounce' className='custom-spinner'/>
            }
          </button>
        )}
      </div>
    )
  }
}

CrudButton.contextTypes = {
  store: PropTypes.object.isRequired
}

export default CrudButton
