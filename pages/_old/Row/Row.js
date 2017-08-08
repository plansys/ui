this.state = {
    mywidth: '100px'
}

this.ubahWidth = () => {
    this.setState({
        mywidth: this.state.mywidth == '888px' ? '999px' : '888px'
    })
}