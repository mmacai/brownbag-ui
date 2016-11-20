<template>
    <div id="app" v-md-theme="'default'">
        <div class="layout-area">
            <heading :text="heading.text" />

            <vote-card
                v-for="vote in votes"
                @update-docker-data="updateDockerData"
                :voteId="vote.id" :title="vote.title" :count="vote.count"
                :imgName="vote.imgUrl"
            />

            <div class="docker-message" v-if="docker.length === 0">
                No valid docker data found
            </div>

            <docker-card
                v-for="container in docker"
                :title="container.title" :containerId="container.containerId"
                :imageName="container.imageName"
            />
        </div>
    </div>
</template>

<script src="./app.js"></script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 2em;
}

.layout-area {
    display: flex;
    flex-wrap: wrap;
}

.docker-message {
    width: 100%;
    padding: 1em;
}
</style>
