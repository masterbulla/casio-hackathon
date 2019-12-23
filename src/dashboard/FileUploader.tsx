import React, {useState, ChangeEvent} from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from 'axios';

// 暫定のAPIのURL
const API_URL = 'localhost:8000/';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export default function FileUploader() {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState();

  const checkImageFileType = (type: string) => {
    if (type === 'text/csv') {
      return true;
    } else {
      return false;
    }
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files === undefined) {
      return;
    } else {
      const files = event.target.files;
      if (files.length > 0 && checkImageFileType(files[0].type)) {
        const csvUrl = URL.createObjectURL(files[0]);
        const data = new FormData();
        data.append('text/csv', files[0]);
        setUrl(csvUrl);
        setFileName(files[0].name);
        setData(data);
      }
      return;
    }
  };

  const resetFile = () => {
    setUrl('');
    setFileName('');
    setData(new FormData());
    return;
  };

  const fileUpload = async () => {
    // CORS問題未解決
    const response = await axios.post(API_URL + 'predict', data);
    console.log(response);
    if (response.status !== 200) {
      console.log('error');
      window.alert('正常にファイルをアップロードできませんでした。');
    } else {
      window.alert(
        '正常にファイルがアップロードできました。データの予測が終わるまでお待ち下さい。'
      );
    }
  };

  return (
    <React.Fragment>
      <Title>診断データアップロード</Title>
      <Grid container justify="center">
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
                startIcon={<CloudUploadIcon />}
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
      <Grid container justify="center">
        <Grid item xs={12}>
          <div className={classes.button}>
            <Button
              component="span"
              variant="contained"
              color="primary"
              fullWidth={true}
              onClick={fileUpload}
            >
              アップロード
            </Button>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
