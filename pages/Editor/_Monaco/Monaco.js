this.on('componentDidMount', () => {
    require.config({paths: {'vs': this.moduleUrl + 'Editor/Monaco/vs'}});
    require(['vs/editor/editor.main'], function () {
        let editor = monaco.editor.create(document.getElementById('container'), {
            value: [
                '<?php',
                'echo "offf";'
            ].join('\n'),
            minimap: {
                enabled: false
            },
            language: 'php'
        });
    });
})
