#!/usr/bin/env python
# coding: utf-8

import flask
import numpy as np
import pandas as pd
from sklearn.externals import joblib
from sklearn import svm
from sklearn.model_selection import GridSearchCV
import pickle
import logging

# 設定
TEST_FILE_NAME = "0_0_20191217132856JST_resample_All.csv"
#TEST_FILE_NAME = "csvjson.json"
MODEL_FILE_NAME = "model.binary"
COLUMNS = ["AccX", "AccY", "AccZ", "GyroX", "GyroY", "GyroZ"]
MAX_TRACE = 10


# initialize our Flask application and pre-trained model
app = flask.Flask(__name__)
app.logger.setLevel(logging.DEBUG)


@app.route("/test", methods=["POST"])
def test():
    json = flask.request.get_json()
    # return flask.jsonify(json)
    app.logger.debug('debug message')
    return json['aa']


@app.route("/predict", methods=["POST"])
def predict():
    response = {
        "success": False,
        "Content-Type": "application/json",
    }

    if flask.request.method == "POST":
        if True:
            # read feature from json
            #json = flask.request.get_json()
            df_test = pd.read_csv(TEST_FILE_NAME, index_col=0)
            df_test = df_test.loc[:, COLUMNS]
            df_test.columns = [col+"_0" for col in COLUMNS]
            for i in range(MAX_TRACE):
                columns = [col+"_{}".format(i) for col in COLUMNS]
                new_columns = [col+"_{}".format(i+1) for col in COLUMNS]

                for column, new_column in zip(columns, new_columns):
                    df_test.loc[:, new_column] = df_test.loc[:, column].rolling(
                        2).sum() - df_test.loc[:, column]
                    df_test = df_test.tail(len(df_test)-MAX_TRACE)

            # 分類結果を出力

            X_test = df_test.values

            with open(MODEL_FILE_NAME, "rb") as f:
                clf = pickle.load(f)

            df_predict = pd.DataFrame(index=df_test.index)
            df_predict.loc[:, "predict"] = clf.predict(X_test)
            response.update(df_predict.to_dict())
            response['success'] = True

    # return the data dictionary as a JSON response
    return flask.jsonify(response)


if __name__ == "__main__":
    print(" * Flask starting server...")
    app.run(debug=True)
