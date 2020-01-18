import React, {useState, useEffect, ChangeEvent} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {mainListItems} from './listItems';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {useTheme} from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';

const API_URL = 'http://127.0.0.1:5000/';

function createData(time: string, amount: number) {
  return {time: time, amount: amount};
}

// ここに震えの値を入れる
const exaData: ChartData[] = [
  createData('10', 0),
  createData('20', 0),
  createData('30', 0),
  createData('40', 0),
  createData('50', 0),
  createData('60', 0),
  createData('70', 0),
  createData('80', 0),
];

interface Predict {
  key: string;
  value: any;
}

interface ChartData {
  time: string;
  amount: number;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://twitter.com/odenmonster">
        Team C
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function preventDefault(event: any) {
  event.preventDefault();
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  fixedSecondHeight: {
    height: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  mt3: {
    marginTop: theme.spacing(3),
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  depositContext: {
    flex: 1,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState(new FormData());
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [jsonName, setJsonName] = useState('');
  // const [predictedData, setPredictedData] = useState([{key: '', value: ''}]);
  const [predictLoading, setPredictLoading] = useState(false);
  const [chartData, setChartData] = useState(exaData);
  const [isPositive, setIsPositive] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedSecondHeightPaper = clsx(classes.paper, classes.fixedSecondHeight);

  const checkImageFileType = (type: string) => {
    if (type === 'text/csv') {
      return true;
    } else {
      return false;
    }
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    } else {
      const files = event.target.files;
      if (files.length > 0 && checkImageFileType(files[0].type)) {
        const data = new FormData();
        data.append('file', files[0]);
        setFileName(files[0].name);
        setData(data);
      }
      return;
    }
  };

  const resetFile = () => {
    setFileName('');
    setData(new FormData());
    return;
  };

  const fileUpload = async () => {
    // CORS問題未解決
    if (!(fileName && data.get('file'))) {
      window.alert('ファイルを選択してください。');
      return;
    }
    const axiosConfig = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    setIsLoading(true);
    const response = await axios.post(API_URL + 'predict', data, axiosConfig);
    setIsLoading(false);
    if (response.status !== 200) {
      console.log('error');
      window.alert('正常にファイルをアップロードできませんでした。');
    } else {
      setUploaded(true);
      setJsonName(response.data.filename.toString());
      return;
    }
  };

  const allReset = (event: any) => {
    event.preventDefault();
    setFileName('');
    setData(new FormData());
    setUploaded(false);
  };

  useEffect(() => {
    const httpGet = async () =>
      await axios.get(API_URL + 'get_json', {
        params: {
          filename: jsonName,
        },
      });

    if (jsonName !== '') {
      if (uploaded) {
        setPredictLoading(true);
      }
      httpGet()
        .then(response => {
          setPredictLoading(false);
          let predicts: Predict[] = Object.entries(response.data.predict).map(
            ([key, value]) => ({
              key,
              value,
            })
          );

          let positiveNum = 0;
          for (let i = 0; i < predicts.length; i++) {
            if (predicts[i].value) {
              positiveNum++;
            }
          }
          if (2 * positiveNum >= predicts.length) {
            setIsPositive(true);
          } else {
            setIsPositive(false);
          }

          let tmpChartData: ChartData[] = [];
          let itr = 1,
            tmpNum = 0;
          for (let i = 0; i < predicts.length; i++) {
            if (predicts[i].value) {
              tmpNum++;
            }

            if (i >= 1000 * itr) {
              tmpChartData.push({
                time: (itr * 10).toString(),
                amount: tmpNum,
              });
              tmpNum = 0;
              itr++;
            }
          }
          setChartData(tmpChartData);
        })
        .catch(error => {
          setPredictLoading(false);
          console.log(error);
        });
    }
  }, [jsonName]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            パーキンソン病監視アプリケーション
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={1} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={7} lg={8}>
              <Paper className={fixedHeightPaper}>
                <Title>今日の振動記録</Title>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis stroke={theme.palette.text.secondary}>
                      <Label
                        angle={270}
                        position="left"
                        style={{
                          textAnchor: 'middle',
                          fill: theme.palette.text.primary,
                        }}
                      >
                        回数
                      </Label>
                    </YAxis>
                    <Bar dataKey="amount" fill="#3f51b5" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            {/* Recent Judgements */}
            <Grid item xs={12} md={5} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Title>パーキンソン病判定</Title>
                <Typography component="p" variant="h4">
                  {uploaded
                    ? isPositive
                      ? '陽性'
                      : '陰性'
                    : 'CSVファイルをアップロードして下さい。'}
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.depositContext}
                >
                  on 22 December, 2019
                </Typography>
                <div>
                  <Link color="primary" href="#" onClick={preventDefault}>
                    View detail
                  </Link>
                </div>
              </Paper>
            </Grid>
            {/* File Upload */}
            <Grid item xs={12} md={5} lg={6}>
              <Paper className={fixedSecondHeightPaper}>
                <Title>診断データアップロード</Title>
                {uploaded ? (
                  <div>
                    <Typography component="p" variant="h5">
                      データの分析が完了しました。
                    </Typography>
                    <Link color="primary" href="#" onClick={allReset}>
                      別のファイルをアップロード
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Grid
                      container
                      alignItems="center"
                      justify="center"
                      className={classes.mt3}
                    >
                      <Grid item xs={12} md={6} lg={6}>
                        <div className={classes.button}>
                          <input
                            accept="text/csv"
                            className={classes.input}
                            id="text-button-file"
                            multiple
                            type="file"
                            onChange={onChangeFile}
                          />
                          <label htmlFor="text-button-file">
                            <Button
                              component="span"
                              variant="contained"
                              color="default"
                              startIcon={<DescriptionOutlinedIcon />}
                              fullWidth={true}
                            >
                              CSVを選択
                            </Button>
                          </label>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <div className={classes.button}>
                          <Button
                            component="span"
                            variant="contained"
                            color="default"
                            onClick={resetFile}
                            fullWidth={true}
                          >
                            リセット
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    <Typography component="p" className={classes.button}>
                      ファイル名: {fileName ? fileName : '選択なし'}
                    </Typography>

                    {isLoading ? (
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item xs={12}>
                          アップロード中
                          <CircularProgress />
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid
                        container
                        alignItems="center"
                        justify="center"
                        className={classes.mt3}
                      >
                        <Grid item xs={12}>
                          <div className={classes.button}>
                            <Button
                              component="span"
                              variant="contained"
                              color="primary"
                              startIcon={<CloudUploadIcon />}
                              fullWidth={true}
                              onClick={fileUpload}
                            >
                              アップロード
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                )}
              </Paper>
            </Grid>
            {/* Recent Conditions */}
            <Grid item xs={12} md={7} lg={6}>
              <Paper className={fixedSecondHeightPaper}>
                <Title>最近の調子</Title>
                {predictLoading ? (
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={12}>
                      読み込み中
                      <CircularProgress />
                    </Grid>
                  </Grid>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">時間(s)</TableCell>
                        <TableCell align="right">陽性/陰性</TableCell>
                      </TableRow>
                    </TableHead>

                    {chartData !== exaData ? (
                      <TableBody>
                        {chartData.map(element => {
                          return (
                            <TableRow>
                              <TableCell align="right">
                                {element.time}
                              </TableCell>
                              <TableCell align="right">
                                {element.amount * 2 >= 1000 ? '陽性' : '陰性'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    ) : (
                      ''
                    )}
                  </Table>
                )}

                <div className={classes.seeMore}>
                  <Link color="primary" href="#" onClick={preventDefault}>
                    さらに見る
                  </Link>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
