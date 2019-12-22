import React from 'react';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>パーキンソン病判定</Title>
      <Typography component="p" variant="h4">
        陽性
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 22 December, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View detail
        </Link>
      </div>
    </React.Fragment>
  );
}
