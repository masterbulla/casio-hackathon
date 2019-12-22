import React from 'react';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(
  id: number,
  date: string,
  averageNum: number,
  isPositive: boolean
) {
  return {id, date, averageNum, isPositive};
}

const rows = [
  createData(0, '16 Mar, 2019', 35.2, true),
  createData(1, '16 Mar, 2019', 20.5, false),
  createData(2, '16 Mar, 2019', 44, true),
  createData(3, '16 Mar, 2019', 5.7, false),
];

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>最近の調子</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">時間</TableCell>
            <TableCell align="right">振動の平均回数</TableCell>
            <TableCell align="right">陽性/陰性</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.averageNum}</TableCell>
              <TableCell align="right">
                {row.isPositive ? '陽性' : '陰性'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          さらに見る
        </Link>
      </div>
    </React.Fragment>
  );
}
