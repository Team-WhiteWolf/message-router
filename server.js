/*jshint esversion: 6 */

const azure = require('azure');

const azureKey = 'Endpoint=sb://servicequeues.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=AUNiefT6dHz3ivqbYvpteI+LlwvOWE2M0OleRycSXzs=';
const asbService = azure.createServiceBusService(azureKey);

const queueIterator = function() {
	var index = 0;
	var queues = [
		'icon-send',
		'user-send',
		'project-send',
		'calendar-send',
		'permission-send',
		'issue-send'
	];

	return {
		next: function() {
			index %= queues.length;
			return {
				value: queues[index++],
				done: false
			};
		}
	};
}();

function requestMessage() {
	asbService.receiveQueueMessage(queueIterator.next().value, { timeoutIntervalInS: 3 }, handleMessage);
}

function handleMessage(error, receivedMessage) {
	if (error) {
		requestMessage();
		return;
	}

	processMessage(receivedMessage);
	requestMessage();
}

function processMessage(message) {
	console.log(message);
}

//FIXME #ExampleImplementation
/*
var message = {
	keks: 'test',
	body: 'Test message',
	customProperties: {
		testproperty: 'TestValue'
	}
};

asbService.sendQueueMessage('user-send', message, function(error){
	if(!error){
		console.log('Message sent!');
	}
});

asbService.receiveQueueMessage('user-send', function(error, receivedMessage){
	if(!error){
		// Message received and deleted
		console.log(receivedMessage.body);
	}
});*/
