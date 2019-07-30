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
- Connector API: 允许构建和运行可重用的生产者或消费者，能够把kafka主题连接到现有的应用程序或数据系统

> Kafka 基础概念

- 无论是kafka集群，还是consumer都依赖于zookeeper集群保存一些meta信息，来保证系统可用性
- Producer
- - 发送消息者称为 Producer
- Consumer
- - 消息接受者称为Consumer
- Consumer Group (CG)
- - 这是kafka用来实现一个topic消息的广播(发给所有的consumer)和单播(发给任意一个consumer)的手段。一个topic可以有多个CG。topic的消息会复制(概念上的复制)到所有的CG，但每个partition只会把消息发给该CG中的一个consumer。如果需要实现广播，只要每个consumer有一个独立的CG就可以了。要实现单播只要所有consumer在同一个CG。用CG还可以将consumer进行自由的分组而不需要多次发送消息到不同的topic
- Broker(代理)
- - 已发布的消息保存在一组服务器中，称之为Kafka集群。集群中的每一个服务器都是一个代理。
- 主题(Topic)
- - Kafka将消息以topic为单位进行归纳(一条消息必须属于某一个主题)
- - 在Kafka集群中，可以有无数的主题
- - Kafka 的主题始终是支持多用户订阅的；也就是说，一个主题可以有零个，一个或多个消费者订阅写入的
数据

- - 分区数(Partitions): 控制topic将分片成多少log。可以显示指定，如果不指定则会使用broker(server.properties)中的num.partitions配置的数量
- - replication-factor副本：控制消息保证在几个broker(服务器)上，一般情况下等于broker的个数。

- 分区(Partitions)

![avator](/images/partitions_offset.png)
- - 每个Topic都有一个或者多个Partitions 构成
- - 每个Partition都是有序且不可变的消息队列
- - Topic的Partition数量可以在创建时配置
- - Partition数量决定了每个Consumer group中并发消费者的最大数量

- 偏移量(offset)
- - 任何发布到partition的消息都会被直接追加到log文件的尾部，每条消息在文件中的位置称为offset(偏移量),offset是一个long型数字，它唯一标记一条消息。消费者通过(offset、partition、topic)跟踪记录.

- 副本
- - 副本因子操作的单位是以分区为单位,每个分区都有各自的主副本和从副本
- - 主副本叫做leader，从副本叫做follower，处于同步状态的副本叫做in-sync replicas(ISR);
- - Follower 通过拉的方式从leader同步数据。消费者和生产者都是从leader读写数据，不与follower交互
- - 当有多个副本数时，kafka并不是将多个副本同时对外提供读取和写入,作用是让kafka读取和写入数据时的高可靠
- log 日志
- - kafka-log 目录下,会根据: 主题-分区 值创建目录
- - 00000000000000000000.index -- 索引 稀疏索引
- - 00000000000000000000.log   -- 数据
- - log 默认情况下会根据1G的大小，创建一个新的segment file文件
- - 00000000000000001123.index -- 1123 offset的开始值
- - 00000000000000001123.log
- log 的优化
- - 可以选择删除或者合并

- kafka复制原理
- - 消费的发送方式：主题\value、主题\key\value、主题\分区\key\value、主题\分区\时间戳
\key\value
- - Kafka 中topic的每个partition有一个预写式的日志文件，虽然partition可以继续细分为若干个segment文件，但是对于上层应用来说可以将partition看成最小的存储单元，每个partition都由一些列有序的、不可变的消息组成，这些消息被连续的追加到partition中。
- - LEO：LogEndOffset的缩写，表示每个partition的log最后一条Message的位置
- - HW： 是HighWatermark的缩写，是指consumer能够看到的此partition的位置

- - 具体描述：Kafka每个topic的partition有N个副本(replicas).
- - kafka 通过多副本机制实现故障自动转移，当kafka集群中一个broker失效情况下仍然保证服务可用。kafka中发生复制时确保partition的日志能有序地写到其他节点上，N个replicas中，其中一个replicas为leader，其他都为follower，leader处理partition的所有读写请求，于此同时，follower会被动定期地去复制leader的数据。kafka提供了数据复制算法保证，如果leader发生故障或挂掉，一个新leader被选举并接受客户端的消息成功写入。
- - leader负责维护和跟踪ISR中所有follower滞后的状态.
- - 当producer发送一条消息到broker后，leader写入消息并复制到所有follower。消息提交之后才被成功复制到所有的同步副本。消息复制延迟受最慢的follower限制，重要的是快速检测慢副本，如果follower"落后"太多或者失效，leader将会把它从ISR中删除.

- leader 将某个follower提出ISR列表的情况：
- - 1. 按数量——如果leader当前的offset已经到10，但是某个follower同步的数据还是2，但是kafka对于数量的偏差设置为6。如果当前偏差小于等于设置的偏差，那么会将该follower提出ISR列表，进入到OSR列表[所有的副本数据 = ISR + OSR]
    2. 按时间——有新数据，多久没有发送确认信息

![avator](images/hwpng.png)

- ISR(副本同步队列)
- - ISR 是所有副本的一个子集，由leader维护ISR列表，follower从leader同步数据有一些延迟，包括延迟时间 replica.lag.time.max.ms和延迟条数replica.lag.max.messages两个维度，当前最新的版本0.10.x中只支持replica.lag.time.max.ms这个维度）。任意一个超过阈值都会把follower剔除出ISR，存入OSR(Outof-Sync Replicas)列表，新加入的follower也会先存放在OSR中。
- - leader 新写入的信息，consumer不能立刻消费，leader会等待该消息被所有ISR中的replicas同步后更新HW，此时消息才能被consumer消费。这样就保证了如果leader所在的broker失效，该消息仍然可以从新选举的leader中获取。对于来自内部的broker的读取请求，没有HW的限制。

- - 同步复制要求所有的能工作的follower都复制完，这条消息才会被commit，这种复制方式是否极大的影响了吞吐率？

- - 异步复制方式
- - follower异步的从leader复制数据，数据只要被leader写入log就被认为已经commit，这种情况下如果follower都还没有复制完，落后于leader时，突然leader宕机，则会丢失数据。而kafka的这种使用ISR的方式则很好的均衡了确保数据不丢失已经吞吐率。

- - Kafka的管理最终都会反馈到Zookeeper节点上。
- - 具体位置：/brokers/topics/[topic]/partitions/[partition]/state.
- - 目前有两个地方会对这个Zookeeper的节点进行维护：
- - 1. Controller维护：Controller 下的LeaderSelector会选举新的leader，ISR和新的leader_epoch及controller_epoch写入Zookeeper的相关节点中。同时发起LeaderAndIsrRequest通知所有的replicas。
    2. leader维护：leader有单独的线程定期检测ISR中follower是否脱离ISR，如果发现ISR变化，则会将新的ISR的信息返回到Zookeeper的相关节点中。
- - Kafka集群中的其中一个Broker会被选举为Controller，主要负责Partition管理和副本状态管理，也会执行类似于重分配partition之类的管理任务。

- kafka 数据可靠性
- - 数据丢失的可能:可以采用callback的方式进行处理，判断异常信息是否为空，如果为空表示正常发送了，否则就有异常，可进行特殊处理

- - 当producer向leader发送数据时，可以通过acks参数来设置数据可靠性的级别：
- - 1. 1(默认)：这意味着producer在ISR中的leader已成功收到的数据并得到确认后发送下一条message。如果leader宕机了，则会丢失数据。
- - 2. 0：这意味着producer无需等待来自broker的确认而继续发送下一批消息。这种情况下数据传输效率最高，但是数据可靠性是最低的
- - 3. all：leader需要等待所有备份都写入日志，这种策略会保证只要有一个备份存活就不会丢失数据，这是最强的保证。

- kafka 消息传输保障
- - Kafka确保消息在producer和consumer之间传输。有以下三种可能的传输保障
- - 1. At most once : 消息可能丢失，但绝不会重复传输
- - 2. At least once : 消息绝不会丢，但可能重复传输
- - 3. Exactly once: 每条消息肯定会被传输一次且仅传输一次

- kafka leader 和 follower 如何通信

> 疑问
- 一个broker服务下，是否可以创建多个分区？
- - 可以，broker数与分区数没有关系
- 一个broker服务下，是否可以创建多个副本因子?
- - 不可以，会报错;
    创建主题时，副本因子应该小于等于可用的broker数
    ```linux
    Error while executing topic command : replication factor: 3 larger than available brokers: 1
    [2019-07-23 17:34:45,963] ERROR org.apache.kafka.common.errors.InvalidReplicationFactorException: replication factor: 3 larger than available brokers: 1
    (kafka.admin.TopicCommand$)
    ```
- 在kafka中，每一个分区会有一个编号，从0开始
- 当执行删除命令之后，topic不是物理删除，而是一个标记删除的操作.
- 标记删除之后的主题是否还可以继续生产数据？
- - 不会有影响
- 如何保证一个主题下的数据，一定是有序的(生产与消费的顺序一致)
- - 让主题下只有一个分区
- 某一个主题下的分区数，对于消费组来说，应该小于等于该主题下的分区数。
- 在使用kafka的过程中，如何保证数据的不丢失，不重复的问题？
# 持续更新...