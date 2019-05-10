'use strict';

var ApmnModdle = require('apmn-moddle').default;

var camundaDescriptor = require('../../resources/camunda');


describe('exports', function() {

  it('should extend apmn-moddle', function() {

    // given
    var moddle = new ApmnModdle({
      camunda: camundaDescriptor
    });

    // when
    var serviceTask = moddle.create('apmn:ServiceTask');

    // then
    expect(serviceTask.$instanceOf('camunda:ServiceTaskLike')).to.be.true;
  });

});