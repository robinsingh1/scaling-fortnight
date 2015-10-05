exports.config =
  # See http://brunch.io for docs.
  plugins:
    react:
      transformOptions:
        # options passed through to `react-tools.main.transformWithDetails()` 
        harmony: yes    # include some es6 transforms 
        sourceMap: no   # generate inline source maps 
        stripTypes: no  # strip type annotations 
      # if you use babel to transform jsx, transformOptions would be passed though to `babel.transform()` 
      # See: http://babeljs.io/docs/usage/options/ 
      babel: false
  npm:
    enabled: true
  files:
    javascripts:
      joinTo:
        'javascripts/vendor.js': /^bower_components/
        'javascripts/app.js': /^app/
        '../../server/client/javascripts/vendor.js': /^bower_components/
        '../../server/client/javascripts/app.js': /^app/
    stylesheets:
      joinTo: 
        'stylesheets/app.css': /^(app|vendor|bower_components)/
        '../../server/client/stylesheets/app.css': /^(app|vendor|bower_components)/
    templates:
      joinTo: 
        'javascripts/app.js'
