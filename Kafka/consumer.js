/**
 * 消费者
 */

const kafka = require('kafka-node');

let conn = {'kafkaHost':'127.0.0.1:9092'};
let consumers = [
    {
        'type': 'consumer',
        'options': {'autoCommit': true},
        'name':'common',
        'topic':[
            {'topic': 'broadcast', 'partition': 0}
        ]
    }
];

let MQ = function(){
    this.client = {};
    this.mq_consumers = {};
}

MQ.prototype.AddConsumer = function (conn, topics, options, handler){
    this.client = new kafka.KafkaClient(conn);
    let consumer = new kafka.Consumer(this.client, topics, options);

    if(!!handler){
        consumer.on('message', handler);
    }

    consumer.on('error', function(err){
        console.error('consumer error ',err.stack);
    });
    this.mq_consumers['common'] = consumer;
}

var mq = new MQ();


mq.AddConsumer(conn, consumers[0].topic, consumers[0].options, function (message){
    //console.log('clientId : ',mq.client.clientId);
    //console.log('topicMetadata ',mq.client.topicMetadata);
    //console.log('correlationId ',mq.client.correlationId);
    //console.log('brokerMetadata ',mq.client.brokerMetadata);
    //console.log('clusterMetadata ',mq.client.clusterMetadata);
    let _consumer = mq.mq_consumers['common'];

    //console.log("----------consumer");
    //console.log('topicMetadata ',_consumer.client.topicMetadata);
    //console.log('brokerMetadata ',_consumer.client.brokerMetadata);
    //console.log('clusterMetadata ',_consumer.client.clusterMetadata);
    //console.log(_consumer.payloads);
    console.log(message.value);
});