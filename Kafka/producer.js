/**
 * 生产者
 */

const kafka = require('kafka-node');

let conn = {'kafkaHost':'127.0.0.1:9092'};

var MQ = function (){
    this.mq_producers = {};
    this.client = {};
}

MQ.prototype.AddProducer = function (conn, handler){
    console.log('增加生产者',conn, this);
    this.client = new kafka.KafkaClient(conn);
    let producer = new kafka.Producer(this.client);

    producer.on('ready', function(){
        if(!!handler){
            handler(producer);
        }
    });

    producer.on('error', function(err){
        console.error('producer error ',err.stack);
    });

    this.mq_producers['common'] = producer;
    return producer;
}
console.log(MQ);
var mq = new MQ();

mq.AddProducer(conn, function (producer){
    producer.createTopics(['broadcast'], function (){
        setInterval(function(){

            var _msg = {
                topic:['broadcast'], 
                messages:[JSON.stringify({"cmd":"testRpc","value":"Hello World"})],
                partition:0
            }


            //console.log('clientId : ',mq.client.clientId);
            //console.log('topicMetadata ',mq.client.topicMetadata);
            //console.log('brokerMetadata ',mq.client.brokerMetadata);
            //console.log('clusterMetadata ',mq.client.clusterMetadata);
            //console.log('brokerMetadataLastUpdate ',mq.client.brokerMetadataLastUpdate);

            mq.mq_producers['common'].send([_msg], function (err, data){
                console.log("..... ",data);
            })
        }, 2000);
    })
});

