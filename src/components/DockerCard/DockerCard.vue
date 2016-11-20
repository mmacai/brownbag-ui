<template>
    <div class="docker-card">
        <md-card md-with-hover>
            <md-card-header>
                <md-avatar>
                    <img src="../../assets/docker.png" alt="Docker">
                </md-avatar>

                <div class="md-title">Image: {{ title }} => ID: {{ containerId }}</div>
            </md-card-header>
        </md-card>
    </div>
</template>

<script src="./dockerCard.js"></script>

<style scoped>
.docker-card {
    width: 100%;
}

.docker-card .md-card .md-card-header div {
    font-size: 1em;
}

.md-title, .md-subhead {
    padding: 0.25em;
}
</style>
