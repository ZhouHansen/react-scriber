import { connect } from 'react-redux'
import { changeType } from '../action'
import StateButton from '../component/StateButton'

const mapStateToProps = (state) => {
  return {
    drawType: state.draw.drawType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDrawClick(drawType){
      dispatch(changeType(drawType))
    }
  }
}

const DrawStateButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(StateButton)

export default DrawStateButton
