<template>
    <div class="vote-card-wrapper">
        <md-card md-with-hover>
            <md-card-media>
                <img :src="imgName" alt="Vote">
            </md-card-media>

            <md-card-content class="text-big">
                <span>{{ title }} recruits: {{ voteCount || count }}</span>
                <md-button class="join-button" v-on:click="addVote()">Join</md-button>
            </md-card-content>
        </md-card>
    </div>
</template>

<script src="./voteCard.js"></script>

<style scoped>
.vote-card-wrapper {
    width: 50%;
}

.text-big {
    font-size: 1em;
    line-height: 2em;
}

.join-button {
    float: right;
    font-size: 1em;
    line-height: 1.5em;
}
</style>
