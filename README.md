# パーキンソン病判定アプリケーション

## 概要

CASIO 主催｢モーションセンサーを用いた新アプリケーション創出ハッカソン｣ で作成したアプリケーションです.

モーションセンサーを用いてパーキンソンか否か判別するアプリケーションです. 集計結果をフロントエンド側からグラフとして見れたり, 時間軸で陽性か陰性かを判別したりします.

## 実装の詳細

フロントエンドは React.js+TypeScript, バックエンドは Flask で動作する SPA です.

モーションセンサーで取得した加速度 3 方向, ジャイロ方向の 6 軸の csv ファイルをフロントエンド側でアップロードすると, バックエンド側で時間軸のデータに整形し, Scikit Learn で SVM の分類モデルを元に, 時間軸で陽性か陰性か判別し, 結果を json としてフロントエンドに投げて, フロントエンドで集計結果を表示します.

## 実行方法

`frontend`というディレクトリに入って,

```
yarn install
yarn start
```

と実行して起動します.

`backend`というディレクトリに入って,

```
python run_server.py
```

と実行して起動します. (ちなみに API サーバーの URL は`http://127.0.0.1:5000/`と設定しているのですが自分の環境に合わせて適宜変更して下さい)

その後フロントエンド側で csv ファイルとかをアップロードして見て下さい.

試しに使える csv ファイルは, `/backend/0_0_20000206014956JST_resample_All.csv`と`/backend/0_0_20191217132856JST_resample_All.csv`です.