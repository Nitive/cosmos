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

_COSMOS_FILTER_FIXTURES = function(fixtureName) {
  return fixtureName.includes('fixture')
}
_COSMOS_FILTER_COMPONENTS = function(componentName) {
  return componentName.includes('index')
}

module.exports = function() {
  var requireComponent = require.context('COSMOS_COMPONENTS', true),
      isComponent = /^\.\/(.+)\.jsx?$/,
      components = {};

  requireComponent.keys().forEach(function(componentPath) {
    if (_COSMOS_FILTER_COMPONENTS) {
      if (!_COSMOS_FILTER_COMPONENTS(componentPath)) {
        return;
      }
    }
    var match = componentPath.match(isComponent);
    if (!match) {
      return;
    }

    // Fixtures are grouped per component
    var componentName = match[1];
    components[componentName] = {
      class: requireComponent(componentPath),
      fixtures: getFixturesForComponent(componentName.slice(0, -6))
    };

    // Allow users to browse components before creating fixtures
    if (!Object.keys(components[componentName].fixtures).length) {
      components[componentName].fixtures['auto-empty'] = {};
    }
  });

  return components;
};

var getFixturesForComponent = function(componentName) {
  var requireFixture = require.context('COSMOS_FIXTURES', true),
      isFixtureOfComponent = new RegExp('./' + componentName + '/([^/]+).js$'),
      fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    if (_COSMOS_FILTER_FIXTURES) {
      if (!_COSMOS_FILTER_FIXTURES(fixturePath)) {
        return;
      }
    }
    var match = fixturePath.match(isFixtureOfComponent);
    if (match) {
      fixtures[match[1].slice(0, -8)] = requireFixture(fixturePath);
    }
  });

  return fixtures;
};
