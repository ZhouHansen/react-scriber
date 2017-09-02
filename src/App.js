import React, { Component } from 'react'
import CrudButton from './app/component/CrudButton'
import DrawSketchCanvas from './app/container/DrawSketchCanvas'
import DrawStateButton from './app/container/DrawStateButton'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

class App extends Component {

  render() {
    return (
      <div className="container">
        <CrudButton/>
        <div className="flex-box">
          <DrawStateButton/>
          <DrawSketchCanvas/>
        </div>
      </div>
    );
  }
}

export default App
