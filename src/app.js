import Heading from './components/Heading/Heading.vue';
import VoteCard from './components/VoteCard/VoteCard.vue';
import DockerCard from './components/DockerCard/DockerCard.vue';
import { fetchVotes, fetchDockerContainers } from './utils/services';

export default {
    name: 'app',
    components: {
        Heading,
        VoteCard,
        DockerCard,
    },
    data() {
        return {
            votes: [
                {
                    id: 'darkSide',
                    title: 'Dark Side',
                    count: 0,
                    imgUrl: 'static/ds.jpg',
                },
                {
                    id: 'lightSide',
                    title: 'Light Side',
                    count: 0,
                    imgUrl: 'static/ls.jpg',
                },
            ],
            docker: [],
            heading: {
                text: 'What will be your future recruit?',
            },
        };
    },
    beforeCreate() {
        fetchVotes()
        .then((data) => {
            data.forEach((vote) => {
                const index = this.votes.findIndex(v => v.id === vote.name);
                this.$set(this.votes[index], 'count', vote.count);
            });
        });

        fetchDockerContainers()
        .then((data) => {
            data.forEach((container) => {
                const containerInfo = {
                    title: container.imageName,
                    imageName: container.imageName,
                    containerId: container.containerId,
                };
                this.docker.push(containerInfo);
            });
        });
    },
    methods: {
        updateDockerData(newDockerInfo) { // TODO
            newDockerInfo.forEach((container) => {
                const containerInfo = {
                    title: container.imageName,
                    imageName: container.imageName,
                    containerId: container.containerId,
                };
                this.docker.push(containerInfo);
            });
        },
    },
};
