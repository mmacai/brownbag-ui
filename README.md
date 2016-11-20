# brownbag-ui

Example application with walkthrough through Docker swarm.
Use with: https://github.com/mmacai/brownbag-service

## Run application using docker-compose locally

```
# build images for UI and Service
docker build -t=brownbag-ui .
docker build -t=brownbag-session .

# run docker-compose, rethinkDB will be automatically downloaded
docker-compose up
```

## Run docker swarm Locally

For running docker swarm locally we will use docker machines, where one docker machine will transition into node. Which will lead to situation similar to have 4 remote server machines.

#### Setup nodes with docker-machine

```sh
# list docker machines
docker-machine ls

# create 4 new docker machines as nodes
# this will take few minutes
for N in 1 2 3 4; do docker-machine create --driver virtualbox node$N; done

# list updated docker machines, you should see 4 new running nodes
docker-machine ls

# get into first docker machine
docker-machine ssh node1

# verify docker version, should be same your's
docker version

# init docker swarm, IP at the end may very, check node1 IP address using docker-machine ls
docker swarm init --advertise-addr 192.168.99.100

# open other 3 nodes via ssh and use docker swarm join command you just received by swarm init
docker-machine ssh node2
docker-machine ssh node3
docker-machine ssh node4

# check current swarm state, you should see all 4 nodes where node1 should be Leader(manager)
docker node ls

# create overlay network
docker network create -d overlay brownbag-network

# make sure that manager will be just manager and nothing will be assigned to it
docker node update --availability drain node1

# run docker-swarm visualizer
# after that visit: 192.168.99.100:5000
# IP may again vary, check IP of node1
docker run -d \
-p 5000:8080 \
-v /var/run/docker.sock:/var/run/docker.sock \
manomarks/visualizer
```

#### Scale application across nodes

```sh
# run database as a service with single instance
docker service create \
    --name brownbag-db-primary \
    -p 3030:8080 \
    --network brownbag-network \
    rethinkdb:2.3.5

# run service as a service with single instance
docker service create \
    --name brownbag-service \
    -p 7000:7000 \
    --mount target=/var/run/docker.sock,source=/var/run/docker.sock,type=bind \
    -e DB_HOSTS=brownbag-db-primary:28015 \
    -e DOCKER_API_VERSION=1.24 \
    -e IMAGE_NAME_SERVICE=mariomacai/brownbag-service \
    --network brownbag-network \
    mariomacai/brownbag-service:1.0.0

# run ui as a service with single instance
docker service create \
    --name brownbag-ui \
    -p 4000:80 \
    --network brownbag-network \
    mariomacai/brownbag-ui:1.0.0

# application should be successfully running at all node IP's(IP's may vary)
# 192.168.99.100:4000
# 192.168.99.101:4000
# 192.168.99.102:4000
# 192.168.99.103:4000

# scale database as a cluster
# create second set of database and join it to first set to create replica set
# instead of node3 you may use another node that is running brownbag-db-primary already
# so we achieve that db replicas are spread across all worker nodes
docker service create \
    --name brownbag-db-secondary \
    -p 3031:8080 \
    --network brownbag-network \
    --constraint 'node.hostname != node3' \
    --replicas 2 \
    rethinkdb:2.3.5 \
    rethinkdb --bind all -j brownbag-db-primary

# at this point database is clustered, everywhere should be table, but using just one DB instance
# visit:
# 192.168.99.100:3030
# 192.168.99.100:3031

# we need to recreate first set of databases to join the second one, otherwise cluster would be broken on failover
docker service rm brownbag-db-primary

docker service create \
    --name brownbag-db-primary \
    -p 3030:8080 \
    --network brownbag-network \
    rethinkdb:2.3.5 \
    rethinkdb --bind all -j brownbag-db-secondary

# modify service to use all 3 replicas
# service will automatically reconfigure table to use them on restart
# scale to 3 replicas
docker service update \
    --env-add DB_REPLICAS=3 \
    --env-add DB_HOSTS=brownbag-db-secondary:28015,brownbag-db-primary:28015 \
    brownbag-service

# scale ui to 3 replicas
docker service scale brownbag-ui=3

# at this point application should be running as before, but now balance between replicas
# 192.168.99.100:4000
# 192.168.99.101:4000
# 192.168.99.102:4000
# 192.168.99.103:4000
# by refreshing page or voting in app you should see different ID's of service where requests were send
```

#### Fix broken page title in UI

```sh
# repair broken title in UI with newer version of image using rolling update
# ui tasks will be updated one by one with 10 second delay
docker service update \
    --image mariomacai/brownbag-ui:1.0.1 \
    --update-delay 10s \
    --update-parallelism 1 \
    brownbag-ui
```

#### Check docker failover abilities

```sh
# produce error on service with "no" restart rule
docker service update \
    --restart-condition none \
    --env-add DB_HOSTS=brownbag-db-fail:28015 \
    brownbag-service

# service tasks will not be restarted, check it with
docker service ps brownbag-service

# set on-failure checking for restarts of services
# service tasks will try automatically restart tasks
docker service update \
    --restart-condition on-failure \
    brownbag-service
```

#### We are ready to start everything globally, because we know what's going on

```sh
# use --mode global which will start services on each node evenly
# --replicas option is not available here
docker service create \
    --name brownbag-service \
    -p 7000:7000 \
    --mount target=/var/run/docker.sock,source=/var/run/docker.sock,type=bind \
    -e DB_HOSTS=brownbag-db-secondary:28015,brownbag-db-primary:28015 \
    -e DOCKER_API_VERSION=1.24 \
    -e IMAGE_NAME_SERVICE=mariomacai/brownbag-service \
    --mode global \
    --network brownbag-network \
    mariomacai/brownbag-service:1.0.0

docker service create \
    --name brownbag-ui \
    -p 4000:80 \
    --mode global \
    --network brownbag-network \
    mariomacai/brownbag-ui:1.0.0
```

## Build setup

``` bash
# install dependencies
npm i

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
