# Kafka
## Kafka是一个分布式消息队列，具有高性能、持久化、多副本备份、横向扩展能力.(pub-sub模型)
> 维基百科
>> Kafka 是由Apache软件基金会开发的一个开源流处理平台，由Scala和JAVA编写.该项目的目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。其持久化层本质是一个"按照分布式事务日志架构的大规模发布/订阅消息队列".Kafka可以通过Kafka Connect连接到外部系统(用于数据输入/输出),并提供了Kafka Streams ———— 一个Java流式处理库.
## 基于kafka-zookeeper 的分布式消息队列系统总体架构如下：
![avator](/images/kafka-zookeeper.png)

> Kafka 架构说明
>> 一个典型的Kafka集群包含若干Producer，若干Broker，若干Consumer，以及一个Zookeeper集群。Kafka通过Zookeeper管理集群配置，选举Leader，以及在Consumer Group发送变化时进行Rebalance(负载均衡)。Producer 使用push(推)模式将消息发布到Broker；Consumer 使用pull(拉)模式从Broker订阅并消费消息。

> Kafka 四大核心
>>
- 生产者API：允许应用程序发布记录流至一个或多个kafka的主题(Topics)<br>
- 消费者API：允许应用程序订阅一个或多个主题，并处理这些主题接收到的记录流<br>
- Streams API: 允许应用程序充当流处理器(stream processor)，从一个或多个主题获取输入流，并生产一个输出流至一个或多个的主题，能够有效地变换输入流为输出流<br>
- Connector API: 允许构建和运行可重用的生产者或消费者，能够把kafka主题连接到现有的应用程序或数据系统 <p>

> Kafka 基础概念
>> 主题(Topic)<br>
>> xxx
# 持续更新...