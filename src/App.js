import React from 'react';
import { useState, useEffect } from 'react';
import RSSParser from 'rss-parser'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EditDialog from './components/EditDialog'
import './App.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const columns = [
  { id: 'name', label: 'Title', minWidth: 170, align: 'center' },
  { id: 'creator', label: 'Creator', minWidth: 100, align: 'left' },
  {
    id: 'link',
    label: 'Link',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'contentSnippet',
    label: 'ContentSnippet',
    minWidth: 170,
    align: 'center'
  }
];


function App() {
  const classes = useStyles();
  const [feed, setFeed] = useState({ items: [] });
  const [tempFeed, setTempFeed] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCount, setMaxCount] = useState(0);
  const [selectedFeed, setSelectedFeed] = useState({})

    /**
     * updateFeeds
     * Reload the data based on TablePagination(previous and next button)
     */
  
  const updateFeeds = (mainColl, itemsPerPage) => {
    const getInitialItems = mainColl.items;
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    const getTotaltems = getInitialItems.slice(begin, end);
    setTempFeed(getTotaltems);
  }

  useEffect(() => {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
    let parser = new RSSParser();
    parser.parseURL(`${CORS_PROXY}https://hnrss.org/newest`, function (err, feed) {
      if (err) throw err;
      setFeed(feed)
      updateFeeds(feed, 10)
      setMaxCount(2);
    })

  }, [])

    /**
     * onHandler
     * To open the model based on boolean 
     */
  const onHandler = (item, index) => {
    setIsOpen(true);
    setSelectedFeed({ item, index })
  }

  useEffect(() => {
    updateFeeds(feed, 10)
  }, [currentPage])

   /**
     * updateFeed
     * call back function to update the selected field 
     */
  const updateFeed = (getFeed) => {
    const updateObj = tempFeed.map((obj, index) => {
      if (index === getFeed.index) {
        return getFeed.item;
      }
      return obj;
    })
    setTempFeed(updateObj);
    setIsOpen(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>RSS Feed</h3>
      </header>
      <div className="App-table">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }} >{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tempFeed.map((item, index) => (
                // {rows.map((row) => (
                <StyledTableRow key={index} onClick={() => onHandler(item, index)}>
                  <TableCell align="left">{item.title}</TableCell>
                  <TableCell align="left">{item.creator}</TableCell>
                  <TableCell align="left">{item.link}</TableCell>
                  <TableCell align="left">{item.contentSnippet}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isOpen && <EditDialog feed={selectedFeed} onSubmitClickHandler={updateFeed} />}
        <div className="pagination-div">
          <ul className="pagination">
            <li className={`list ${currentPage === 1 ? 'disable' : ''}`}>
              <a href onClick={() => setCurrentPage(currentPage - 1)}>« Prev</a>
            </li>
            <li className={`list ${currentPage === maxCount ? 'disable' : ''}`}>
              <a href onClick={() => setCurrentPage(currentPage + 1)}>Next »</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
