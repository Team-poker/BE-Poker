let votes = [];

function updateVotes(vote) {
  if (votes.length === 0) {
    votes.push(vote);
  } else {
    const filteredVotes = [];
    votes.forEach((item) => {
        if ((item.userId === vote.userId && item.issueTitle !== vote.issueTitle) || 
        (item.issueTitle === vote.issueTitle && item.userId !== vote.userId) ||
        (item.userId !== vote.userId && item.issueTitle !== vote.issueTitle)) {
               filteredVotes.push(item);
        }
    });
    console.log(filteredVotes, '= FILTERED');
    filteredVotes.push(vote);
    votes = [...filteredVotes];
  }
  return votes;
}

module.exports = {
  updateVotes,
};
