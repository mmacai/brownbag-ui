import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const vue = new Vue();

export function fetchVotes() {
    return vue.$http.get('api/votes')
    .then(response => JSON.parse(response.body))
    .catch(err => console.error(err));
}

export function updateVotes(data) {
    return vue.$http.post('api/votes', JSON.stringify(data))
    .then(response => JSON.parse(response.body))
    .catch(err => console.error(err));
}

export function fetchDockerContainers() {
    return vue.$http.get('api/docker')
    .then(response => JSON.parse(response.body))
    .catch(err => console.error(err));
}

export default {
    fetchVotes,
    updateVotes,
    fetchDockerContainers,
};
