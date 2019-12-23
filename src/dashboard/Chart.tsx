import React from 'react';
import {useTheme} from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time: string, amount?: number) {
  return {time, amount};
}

// ここに震えの値を入れる
const data = [
  createData('00:00', 0),
  createData('03:00', 30),
  createData('06:00', 60),
  createData('09:00', 80),
  createData('12:00', 150),
  createData('15:00', 200),
  createData('18:00', 240),
  createData('21:00', 240),
  createData('24:00', 220),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>今日の振動記録</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{textAnchor: 'middle', fill: theme.palette.text.primary}}
            >
              回数
            </Label>
          </YAxis>
          <Bar dataKey="amount" fill="#3f51b5" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
