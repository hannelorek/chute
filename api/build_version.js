// return build details

import { build_date, build_timestamp, commit_ref } from './build_version_lib';

export default (req, res) => {
  return (
    {
      "build_date": build_date,           //  ISO-8601 date
      "build_timestamp": build_timestamp, //  ISO-8601 timestamp
      "commit_ref": commit_ref,           //  commit reference hash
    }
  )
}

// sample output:
// {"build_date":"2021-01-01","build_timestamp":"2021-01-01T12:00:00+00:00","commit_ref":"992318da571be8dfff662a29a39e8e6cdd981701"
