'use strict';

var some = require('min-dash').some;

var ALLOWED_TYPES = {
  FailedJobRetryTimeCycle: [
    'apmn:StartEvent',
    'apmn:BoundaryEvent',
    'apmn:IntermediateCatchEvent',
    'apmn:Activity'
  ],
  Connector: [ 'apmn:EndEvent', 'apmn:IntermediateThrowEvent' ],
  Field: [ 'apmn:EndEvent', 'apmn:IntermediateThrowEvent' ]
};


function is(element, type) {
  return element && (typeof element.$instanceOf === 'function') && element.$instanceOf(type);
}

function exists(element) {
  return element && element.length;
}

function includesType(collection, type) {
  return exists(collection) && some(collection, function(element) {
    return is(element, type);
  });
}

function anyType(element, types) {
  return some(types, function(type) {
    return is(element, type);
  });
}

function isAllowed(propName, propDescriptor, newElement) {
  var name = propDescriptor.name,
      types = ALLOWED_TYPES[ name.replace(/camunda:/, '') ];

  return name === propName && anyType(newElement, types);
}


function CamundaModdleExtension(eventBus) {

  eventBus.on('property.clone', function(context) {
    var newElement = context.newElement,
        propDescriptor = context.propertyDescriptor;

    this.canCloneProperty(newElement, propDescriptor);
  }, this);
}

CamundaModdleExtension.$inject = [ 'eventBus' ];

CamundaModdleExtension.prototype.canCloneProperty = function(newElement, propDescriptor) {

  if (isAllowed('camunda:FailedJobRetryTimeCycle', propDescriptor, newElement)) {
    return includesType(newElement.eventDefinitions, 'apmn:TimerEventDefinition') ||
           includesType(newElement.eventDefinitions, 'apmn:SignalEventDefinition') ||
           is(newElement.loopCharacteristics, 'apmn:MultiInstanceLoopCharacteristics');
  }

  if (isAllowed('camunda:Connector', propDescriptor, newElement)) {
    return includesType(newElement.eventDefinitions, 'apmn:MessageEventDefinition');
  }

  if (isAllowed('camunda:Field', propDescriptor, newElement)) {
    return includesType(newElement.eventDefinitions, 'apmn:MessageEventDefinition');
  }
};

module.exports = CamundaModdleExtension;
