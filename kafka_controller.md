> Kafka  Controller
在分布式系统中，总会有一个地方需要对全局meta做一个统一的维护，Kafka的Controller就是充当这个角色的.
- Controller 是运行在broker上的，任何一台broker都可以作为Controller，但是一个集群同时只能存在一个Controller，也就意味着Controller与数据节点是在一起的，Controller做的主要事情如下：
- - 1. broker的上线、下线处理；
- - 2. 新创建的topic或已有topic的分区扩容，处理分区副本的分配、leader选举；
- - 3. 管理所有副本的状态机和分区的状态机，处理状态机的变化事件；
- - 4. topic删除、副本迁移、leader切换等处理