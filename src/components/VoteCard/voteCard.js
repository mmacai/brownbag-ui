import { updateVotes } from '../../utils/services';

export default {
    name: 'voteCard',
    data() {
        return {
            voteCount: undefined,
        };
    },
    props: ['title', 'count', 'imgName', 'voteId', 'updateVotesFetchDocker'],
    methods: {
        addVote() {
            this.voteCount = this.voteCount ? this.voteCount + 1 : this.count + 1;
            const data = { name: this.voteId, count: this.voteCount };

            updateVotes(data)
            .then(res => this.$emit('update-docker-data', res));
        },
    },
};
