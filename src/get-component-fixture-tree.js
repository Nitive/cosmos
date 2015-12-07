/**
  * This file holds the logic for aggregating all the component and fixture
  * paths from the drive for the Component Playground. It could easily be a
  * separate module, but since the file structure differs from project to
  * project, it's useful to be able to alter this file as needed.
  *
  * Output example:
  * {
  *   "SimpleButton": {
  *     "class": [ReactClass],
  *     "fixtures": {
  *       "disabled": {
  *         "disabled": true
  *       },
  *       "with-100-clicks": {
  *         "disabled": false,
  *         "state": {
  *           "clicks": 100
  *         }
  *       }
  *     }
  *   }
  * }
  */

function getFixturesPatternDefault(componentName) {
  return new RegExp('./' + componentName + '/([^/]+).js$')
}


module.exports = function() {
  var options = {};
  options.componentsPattern = window.COSMOS_COMPONENTS_PATTERN || /^\.\/(.+)\.jsx?$/;
  options.getFixturesPattern = window.COSMOS_GET_FIXTURES_PATTERN || getFixturesPatternDefault;

  var requireComponent = require.context('COSMOS_COMPONENTS', true),
      isComponent = options.componentsPattern,
      components = {};

  requireComponent.keys().forEach(function(componentPath) {
    var match = componentPath.match(isComponent);
    if (!match) {
      return;
    }

    // Fixtures are grouped per component
    var componentName = match[1];
    components[componentName] = {
      class: requireComponent(componentPath),
      fixtures: getFixturesForComponent(componentName, options)
    };

    // Allow users to browse components before creating fixtures
    if (!Object.keys(components[componentName].fixtures).length) {
      components[componentName].fixtures['auto-empty'] = {};
    }
  });

  return components;
};

var getFixturesForComponent = function(componentName, options) {
  var requireFixture = require.context('COSMOS_FIXTURES', true),
      isFixtureOfComponent = options.getFixturesPattern(componentName),
      fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    var match = fixturePath.match(isFixtureOfComponent);
    if (match) {
      fixtures[match[1]] = requireFixture(fixturePath);
    }
  });

  return fixtures;
};
