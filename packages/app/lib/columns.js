const Types = {
  DEFAULT: 'DEFAULT',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  PULL_REQUEST: 'PULL_REQUEST',
  EXTERNAL_PULL_REQUEST: 'EXTERNAL_PULL_REQUEST'
};

class Columns {

  constructor(columns) {
    this.columns = columns;

    this.columnLabels = columns.reduce((labels, column) => {
      if (column.label) {
        labels[column.label] = true;
      }

      return labels;
    }, {});

    this._getter = columnGetter(columns);
  }

  getForIssue(issue) {
    return this._getter(issue);
  }

  isColumnLabel(label) {
    return this.columnLabels[label];
  }
}


module.exports = Columns;


function columnGetter(columns) {

  const sortedColumns = columns.slice().sort((a, b) => {
    if (a.label && !b.label) {
      return -1;
    }

    return 1;
  });


  const defaultColumn = columns.find(c => c.type === Types.DEFAULT) || columns[0];

  return function(issue) {

    const column = sortedColumns.find(column => {

      const issueClosed = issue.state === 'closed';

      const columnLabel = column.label;

      const columnClosed = column.closed === true;

      if (issueClosed !== columnClosed) {
        return false;
      }

      if (!columnLabel) {
        return true;
      }

      return issue.labels.find(l => l.name === columnLabel);
    });

    return (column || defaultColumn).name;
  };
}