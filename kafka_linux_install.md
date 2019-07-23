# Kafka linux 安装步骤

> 安装步骤
- 安装JDK
    Kafka 使用Zookeeper 来保存相关配置信息，Kafka及Zookeeper 依赖Java运行环境。
 <a>https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html</a>

- - 下载 JDK (jdk-8u221-linux-x64.tar.gz) <br>
    解压<br>
    ```linux
    tar -zxvf jdk-8u65-linux-x64.tar.gz
    mv jdk1.8.0_221 java
    ```
    配置Java环境变量<br>
    ```linux
    vi /etc/profile
    ```
    在配置文件尾部增加<br>
    ```linux
    export JAVA_HOME=/usr/local/software/java
    export PATH=$JAVA_HOME/bin:$PATH
    export CLASSPATH=:#JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
    ```
- 下载Kafka
    ```linux
    wget http://labfile.oss.aliyuncs.com/courses/859/kafka_2.10-0.10.2.1.tgz
    ```
    - 解压Kafka
    ```linux
    tar -zxvf kafka_2.10-0.10.2.1.tgz 
    ```
    - 进入配置文件目录
    ``` linux
    cd /usr/local/software/kafka_2.10-0.10.2.1/config
    ```
    - 修改配置文件server.properties
    ```linux
    log.dirs=/usr/local/logs/kafka
    zookeeper.connect=localhost:2181
    ```
- 编写启动脚本kafka_start.sh
    ```linux
    #启动zookeeper
    /usr/local/software/kafka_2.10-0.10.2.1/bin/zookeeper-server-start.sh /usr/local/software/kafka_2.10-0.10.2.1/config/zookeeper.properties &
    #等3秒后执行
    sleep 3
    #启动kafka
    /usr/local/software/kafka_2.10-0.10.2.1/bin/kafka-server-start.sh /usr/local/software/kafka_2.10-0.10.2.1/config/server.properties &
    ```
- 编写停止脚本kafka_stop.sh
    ```linux
    #关闭zookeeper
    /usr/local/software/kafka_2.10-0.10.2.1/bin/zookeeper-server-stop.sh /usr/local/software/kafka_2.10-0.10.2.1/config/zookeeper.properties &
    #等3秒后执行
    sleep 3
    #关闭kafka
    /usr/local/software/kafka_2.10-0.10.2.1/bin/kafka-server-stop.sh /usr/local/software/kafka_2.10-0.10.2.1/config/server.properties &
    ```
-  启动kafka
    ```linux
    ./kafka_start.sh
- 使用jps 查看
    ```linux
    root@FM:/usr/local/software# jps
    4649 Jps
    4377 Kafka
    4139 QuorumPeerMain
    ```

> Kafka 使用
- 创建主题
```topic
./kafka-topics.sh --create --topic mytopic2 --zookeeper localhost:2181 --partitions 3 --replication-factor 1
```
    执行结果
    Created topic "mytopic2".

- 查看当前主题
```topic
 ./kafka-topics.sh --describe --zookeeper localhost:2181
 或只看主题名称
 ./kafka-topics.sh --list --zookeeper localhost:2181
```
    执行结果
    Topic:mytopic2  PartitionCount:3        ReplicationFactor:1     Configs:
        Topic: mytopic2 Partition: 0    Leader: 0       Replicas: 0     Isr: 0
        Topic: mytopic2 Partition: 1    Leader: 0       Replicas: 0     Isr: 0
        Topic: mytopic2 Partition: 2    Leader: 0       Replicas: 0     Isr: 0
    Topic:mytopic3  PartitionCount:3        ReplicationFactor:1     Configs:
        Topic: mytopic3 Partition: 0    Leader: 0       Replicas: 0     Isr: 0
        Topic: mytopic3 Partition: 1    Leader: 0       Replicas: 0     Isr: 0
        Topic: mytopic3 Partition: 2    Leader: 0       Replicas: 0     Isr: 0


- 查看某个主题是否存在
    ```topic
    ./kafka-topics.sh --list --zookeeper localhost:2181|grep mytopic11
    ```

- 修改主题
    ```topic
    ./kafka-topics.sh --zookeeper localhost:2181 --alter --topic mytopic2 --partitions 10
    ```