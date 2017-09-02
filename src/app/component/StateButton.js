import React, {Component} from 'react'
import PropTypes from 'prop-types'

import '../style/StateButton.css'

class StateButton extends Component {

  render() {
    const Buttons = [
      {
        text: '画线',
        id: 'line',
        className: 'btn btn-outline-success'
      },
      {
        text: '选点',
        id: 'ctrlline',
        className: 'btn btn-outline-success'
      },
      {
        text: '移动',
        id: 'move',
        className: 'btn btn-outline-success'
      },
      {
        text: '删除',
        id: 'remove',
        className: 'btn btn-outline-danger'
      }
    ]

    const {drawType, onDrawClick} = this.props

    return (
      <div className="draw">
        {Buttons.map(button =>
          <button
            key={button.id}
            type="button"
            className={button.className}
            onClick={() => onDrawClick(button.id)}
            id={button.id}
            ref={
              input => {
                if (drawType === button.id){
                  this.sInput = input
                }
              }
            }>
            {button.text}
          </button>
        )}
      </div>
    )
  }
}

StateButton.propTypes = {
  drawType: PropTypes.string.isRequired,
  onDrawClick: PropTypes.func.isRequired
}

export default StateButton
