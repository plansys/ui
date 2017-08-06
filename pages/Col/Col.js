this.state = {    
    backgroundColor: 'red',
    class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12'
}

this.updateState = (props) => {
    var classTemp = '';
    if (props.xs) {        
        classTemp += 'col-xs-' + props.xs;        
    } else {
        classTemp += 'col-xs-12';        
    }

    if (props.sm) {        
        classTemp += ' col-sm-' + props.sm;        
    } else {
        classTemp += ' col-sm-12';        
    }

    if (props.md) {        
        classTemp += ' col-md-' + props.md;        
    } else {
        classTemp += ' col-md-12';        
    }

    if (props.lg) {        
        classTemp += ' col-lg-' + props.lg;        
    } else {
        classTemp += ' col-lg-12';        
    }
    
    if(props.padding == false) {
        classTemp += ' no-padding';        
    }


    if(classTemp != ''){
        this.setState({
            class: classTemp
        })
    }
    

    if (props.backgroundColor) {
        this.setState({
            backgroundColor: props.backgroundColor 
        });
    }
}

this.on('componentWillMount', () => {
    this.updateState(this.props);
})

this.on('componentWillReceiveProps', () => {
    this.updateState(this.props);
})
