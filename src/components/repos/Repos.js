import React from "react";
import PropTypes from "prop-types";
import RepoItems from "./RepoItems";

const Repos = ({ repos }) => {
  return repos.map((repo) => <RepoItems key={repo.id} repo={repo} />);
};
Repos.prototype = {
  repos: PropTypes.array.isRequired,
};
export default Repos;
